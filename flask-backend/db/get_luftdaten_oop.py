from dateutil.parser import parse
import requests
# from pprint import pprint

from db.query_scripts import floatify, floor_date, floor_date_2
from config import luftdaten_dictionary
from db.mongo import db_insert, db_info, db_readings

from bs4 import BeautifulSoup



# class DatabaseInterface:
#     def __init__(self):
#         self.url = "mongodb://localhost:27017/"
#         self.db = MongoClient(self.url)["AirBDN"]
#         self.pyinfo = self.db.info
#         self.pyreadings = self.db.readings
#
#
#     def insert(self, target_db, filter_dict, insert_dict):
#         target_db.update_one(filter_dict, {'$set': insert_dict}, upsert=True)
#
#     def query(target_db, filter_dict={}):
#         return target_db.find(filter_dict)
#


class SensorDataHandler:
    def __init__(self, area, humidity):
        # assert isinstance(db, object)
        # self.db = db
        self.__area = area
        self.__data = {}
        self.__humidity = humidity
        self.__hum_limit = 70

    def get_raw_data(self):
        try:
            requests.get(
                f"https://api.luftdaten.info/v1/filter/box={self.__area}").raise_for_status()
        except:
            print(f"    error: could not get info from luftdaten API")
        else:
            self.__data = requests.get(
                f"https://api.luftdaten.info/v1/filter/box={self.__area}").json()
            # print(self.__data)

    def insert_info_pairs(self, particle_entry, weather_entry):
        hum = None
        # insert the info about the particle and weather sensor
        db_insert(db_info, {"_id": particle_entry['location']['id']},
                  {"lat": round(floatify(particle_entry['location']['latitude']), 3),
                   "lon": round(floatify(particle_entry['location']['longitude']), 3),
                   f"sensors.{particle_entry['sensor']['sensor_type']['name']}": particle_entry['sensor']['id'],
                   f"sensors.{weather_entry['sensor']['sensor_type']['name']}": weather_entry['sensor']['id']
                   })

        # insert the readings from the weather sensor
        for reading in weather_entry["sensordatavalues"]:

            db_insert(db_info, {"_id": weather_entry['location']['id']},
                      {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(reading['value'])})

            # due to the fault in the DHT22 humidity sensor, replace it's humidity with the current average of aberdeen
            if weather_entry['sensor']['sensor_type']['name'] != "DHT22" and reading[
                'value_type'] == "humidity" and float(reading['value']) > self.__hum_limit:
                hum = float(reading['value'])

        if weather_entry['sensor']['sensor_type']['name'] == "DHT22":
            db_insert(db_info, {"_id": weather_entry['location']['id']},
                      {"recent_values.true_humidity": self.__humidity})
            if self.__humidity > self.__hum_limit:
                hum = self.__humidity

        # insert the readings from the particle sensor
        for reading in particle_entry["sensordatavalues"]:
            db_insert(db_info, {"_id": particle_entry['location']['id']},
                      {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(reading['value'])})

            if hum and reading['value_type'] == "P1":

                db_insert(db_info, {"_id": particle_entry['location']['id']},
                          {f"recent_values.true_{luftdaten_dictionary[reading['value_type']]}": round(
                              float(self.normalise_pm10(floatify(reading['value']), hum)), 2)})

            elif hum and reading['value_type'] == "P2":

                db_insert(db_info, {"_id": particle_entry['location']['id']},
                          {f"recent_values.true_{luftdaten_dictionary[reading['value_type']]}": round(
                              float(self.normalise_pm25(floatify(reading['value']), hum)), 2)})

    def insert_readings_pairs(self, particle_entry, weather_entry):
        hum = None

        for reading in weather_entry['sensordatavalues']:
            db_insert(db_readings,
                      {"location_id": weather_entry['location']['id'],
                       "timestamp": floor_date(parse(weather_entry['timestamp']))},
                      {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

            if weather_entry['sensor']['sensor_type']['name'] != "DHT22" and reading[
                'value_type'] == "humidity" and float(reading['value']) > self.__hum_limit:
                hum = float(reading['value'])

        if weather_entry['sensor']['sensor_type']['name'] == "DHT22":
            db_insert(db_readings, {"location_id": weather_entry['location']['id']},
                      {"true_humidity": self.__humidity})
            if self.__humidity > self.__hum_limit:
                hum = self.__humidity

        for reading in particle_entry['sensordatavalues']:
            db_insert(db_readings,
                      {"location_id": particle_entry['location']['id'],
                       "timestamp": floor_date(parse(particle_entry['timestamp']))},
                      {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

            if hum and reading['value_type'] == "P1":

                db_insert(db_readings,
                          {"location_id": particle_entry['location']['id'],
                           "timestamp": floor_date(parse(particle_entry['timestamp']))},
                          {"true_" + luftdaten_dictionary[reading['value_type']]: round(
                              float(self.normalise_pm10(floatify(reading['value']), hum)), 2)})


            elif hum and reading['value_type'] == "P2":

                db_insert(db_readings,
                          {"location_id": particle_entry['location']['id'],
                           "timestamp": floor_date(parse(particle_entry['timestamp']))},
                          {"true_" + luftdaten_dictionary[reading['value_type']]: round(
                              float(self.normalise_pm25(floatify(reading['value']), hum)), 2)})

    # for each reading inset into the readings database
    def insert_readings(self, particle_entry):
        for reading in particle_entry['sensordatavalues']:
            db_insert(db_readings,
                      {"location_id": particle_entry['location']['id'],
                       "timestamp": floor_date(parse(particle_entry['timestamp']))},
                      {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

    def insert_info(self, entry):
        db_insert(db_info, {"_id": entry['location']['id']},
                  {"lat": round(floatify(entry['location']['latitude']), 3),
                   "lon": round(floatify(entry['location']['longitude']), 3),
                   f"sensors.{entry['sensor']['sensor_type']['name']}": entry['sensor']['id']})

        for reading in entry["sensordatavalues"]:
            db_insert(db_info, {"_id": entry['location']['id']},
                      {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(reading['value'])})

    def mongo_update_info(self):
        if self.__data:
            used_entry = []

            # for each entry in data pair the weather sensor with the particle sensor then add it to the paired entry so is not looped over again
            for entry in self.__data:
                if entry['sensor']['sensor_type']['name'] == "SDS011" and entry['id'] not in used_entry:
                    for entry_two in self.__data:

                        # where sensor location is the same, sensor id is different and timestamp is the same/similar
                        # to pair similar times the timestamp is rounded down to the nearest 30s and paired with match
                        if (entry['location']['id'] == entry_two['location']['id']) and (
                                entry['sensor']['id'] != entry_two['sensor']['id']) and (
                                floor_date_2(parse(entry['timestamp'])) == floor_date_2(parse(entry_two['timestamp']))):
                            # -------------------TEST PRINTS---------------------------
                            print("sensor location:        ", entry['location']['id'])
                            print("sensor type:        ", entry['sensor']['sensor_type']['name'], "   sensor:        ",
                                  entry['sensor']['id'], "     timestamp:     ", entry['timestamp'])
                            print("sensor type:        ", entry_two['sensor']['sensor_type']['name'],
                                  "   sensor:        ", entry_two['sensor']['id'], "     timestamp:     ",
                                  entry_two['timestamp'], "\n")

                            used_entry.append(entry['id'])
                            used_entry.append(entry_two['id'])

                            self.insert_info_pairs(entry, entry_two)
                            self.insert_readings_pairs(entry, entry_two)

                            print("Entry:      ", entry)
                            print("Entry:      ", entry_two, "\n")


            for entry in self.__data:
                if entry['id'] not in used_entry:
                    self.insert_info(entry)
                    self.insert_readings(entry)
                    print("Entry:      ", entry, "\n")


        # print(list(db_query(db_info)))

    @staticmethod
    def normalise_pm25(pm25, hum):
        return pm25 / (1.0 + 0.48756 * pow((hum / 100.0), 8.60068))

    @staticmethod
    def normalise_pm10(pm10, hum):
        return pm10 / (1.0 + 0.81559 * pow((hum / 100.0), 5.83411))


class HumidityScrape:
    def __init__(self, date):
        self.__date = date
        self.__url = f"https://www.metoffice.gov.uk/weather/forecast/gfnt07u1s#?date={self.__date}"
        response = requests.get(self.__url)
        self.__html = response.content
        self.__soup = BeautifulSoup(self.__html, "html.parser")

    def set_date(self, date):
        self.__date = date

    def get_humidity(self):
        return int(self.__soup.find('span', {'class': 'humidity'}).text.replace('%', ''))


def main():
    # aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"
    hum = HumidityScrape("2020-02-13")

    dug = SensorDataHandler("57.23,-2.36,57.07,-2.04", hum.get_humidity())

    dug.get_raw_data()
    dug.mongo_update_info()

    # pprint(mongo_update_info(aberdeen_box))
    return ()


if __name__ == '__main__':
    main()
