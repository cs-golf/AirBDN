from dateutil.parser import parse
import requests
# from pprint import pprint

from query_scripts import floatify, floor_date, floor_date_2
from config import luftdaten_dictionary
from DatabaseHandler import DatabaseHandler
from HumidityScrape import HumidityScrape

from SensorScrape import SensorScrape


class SensorDataHandler:
    def __init__(self, area, url, db_name):
        self.__area = area

        self.__s_scaper = SensorScrape(self.__area)

        self.__db = DatabaseHandler(url, db_name)

        # area needs to be added
        self.__h_scaper = HumidityScrape()


        self.__humidity = self.__h_scaper.get_humidity()
        self.__h_limit = 70

    def __new_h(self):
        return self.__h_scaper.get_humidity()

    def __insert_info_pairs(self, particle_entry, weather_entry):
        # if hum is set to a value then it means the humidity is higher than the limit and the pm10 and pm25 need corrected
        hum = None

        # insert the info about the particle and weather sensor
        self.__db.insert(self.__db.pyinfo, {"_id": particle_entry['location']['id']},
                         {"lat": round(floatify(particle_entry['location']['latitude']), 3),
                          "lon": round(floatify(particle_entry['location']['longitude']), 3),
                          f"sensors.{particle_entry['sensor']['sensor_type']['name']}": particle_entry['sensor']['id'],
                          f"sensors.{weather_entry['sensor']['sensor_type']['name']}": weather_entry['sensor']['id']
                          })

        # insert the readings from the weather sensor
        for reading in weather_entry["sensordatavalues"]:

            # inserts raw values to db
            self.__db.insert(self.__db.pyinfo, {"_id": weather_entry['location']['id']},
                             {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(
                                 reading['value'])})

            # if not a DHT22 sensor and the humidity greater that the faulty limit set the hum to the humidity
            if weather_entry['sensor']['sensor_type']['name'] != "DHT22" and reading[
                'value_type'] == "humidity" and float(reading['value']) > self.__h_limit:
                hum = float(reading['value'])

        # due to the fault in the DHT22 humidity sensor, replace it's humidity with the current average of aberdeen
        if weather_entry['sensor']['sensor_type']['name'] == "DHT22":
            self.__db.insert(self.__db.pyinfo, {"_id": weather_entry['location']['id']},
                             {"recent_values.true_humidity": self.__humidity})
            if self.__humidity > self.__h_limit:
                hum = self.__humidity

        # insert the readings from the particle sensor
        for reading in particle_entry["sensordatavalues"]:
            # inserts raw values to db
            self.__db.insert(self.__db.pyinfo, {"_id": particle_entry['location']['id']},
                             {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(
                                 reading['value'])})

            # if him is not none then it mean the pm10 and pm25 need corrected
            # on loop iteration for P1 and P2, if hum is not none insert normalised reading
            if hum and reading['value_type'] == "P1":

                self.__db.insert(self.__db.pyinfo, {"_id": particle_entry['location']['id']},
                                 {f"recent_values.true_{luftdaten_dictionary[reading['value_type']]}": round(
                                     float(self.__normalise_pm10(floatify(reading['value']), hum)), 2)})

            elif hum and reading['value_type'] == "P2":

                self.__db.insert(self.__db.pyinfo, {"_id": particle_entry['location']['id']},
                                 {f"recent_values.true_{luftdaten_dictionary[reading['value_type']]}": round(
                                     float(self.__normalise_pm25(floatify(reading['value']), hum)), 2)})

    # does basically the same but for readings
    def __insert_readings_pairs(self, particle_entry, weather_entry):
        hum = None

        for reading in weather_entry['sensordatavalues']:
            self.__db.insert(self.__db.pyreadings,
                             {"location_id": weather_entry['location']['id'],
                              "timestamp": floor_date(parse(weather_entry['timestamp']))},
                             {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

            if weather_entry['sensor']['sensor_type']['name'] != "DHT22" and reading[
                'value_type'] == "humidity" and float(reading['value']) > self.__h_limit:
                hum = float(reading['value'])

        if weather_entry['sensor']['sensor_type']['name'] == "DHT22":
            self.__db.insert(self.__db.pyreadings, {"location_id": weather_entry['location']['id']},
                             {"true_humidity": self.__humidity})
            if self.__humidity > self.__h_limit:
                hum = self.__humidity

        for reading in particle_entry['sensordatavalues']:
            self.__db.insert(self.__db.pyreadings,
                             {"location_id": particle_entry['location']['id'],
                              "timestamp": floor_date(parse(particle_entry['timestamp']))},
                             {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

            if hum and reading['value_type'] == "P1":

                self.__db.insert(self.__db.pyreadings,
                                 {"location_id": particle_entry['location']['id'],
                                  "timestamp": floor_date(parse(particle_entry['timestamp']))},
                                 {"true_" + luftdaten_dictionary[reading['value_type']]: round(
                                     float(self.__normalise_pm10(floatify(reading['value']), hum)), 2)})


            elif hum and reading['value_type'] == "P2":

                self.__db.insert(self.__db.pyreadings,
                                 {"location_id": particle_entry['location']['id'],
                                  "timestamp": floor_date(parse(particle_entry['timestamp']))},
                                 {"true_" + luftdaten_dictionary[reading['value_type']]: round(
                                     float(self.__normalise_pm25(floatify(reading['value']), hum)), 2)})

    # for each reading insert into the readings database
    def __insert_readings(self, particle_entry):
        for reading in particle_entry['sensordatavalues']:
            self.__db.insert(self.__db.pyreadings,
                             {"location_id": particle_entry['location']['id'],
                              "timestamp": floor_date(parse(particle_entry['timestamp']))},
                             {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

    # for each info insert into the info database
    def __insert_info(self, entry):
        self.__db.insert(self.__db.pyinfo, {"_id": entry['location']['id']},
                         {"lat": round(floatify(entry['location']['latitude']), 3),
                          "lon": round(floatify(entry['location']['longitude']), 3),
                          f"sensors.{entry['sensor']['sensor_type']['name']}": entry['sensor']['id']})

        for reading in entry["sensordatavalues"]:
            self.__db.insert(self.__db.pyinfo, {"_id": entry['location']['id']},
                             {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(
                                 reading['value'])})

    def mongo_update_info(self):
        s_data = self.__s_scaper.get_raw_info()
        self.__new_h()

        if s_data:
            used_entry = []

            # -------------------TEST PRINTS------------------------------------------------------------------------------
            print("TEST PRINT FOR PAIRED SENSORS")
            print("------------------------------------------------------------------------------------------------------------")
            # ------------------------------------------------------------------------------------------------------------


            # for each entry in data pair the weather sensor with the particle sensor then add it to the paired entry so is not looped over again
            for entry in s_data:
                if entry['sensor']['sensor_type']['name'] == "SDS011" and entry['id'] not in used_entry:
                    for entry_two in s_data:

                        # where sensor location is the same, sensor id is different and timestamp is the same/similar
                        # to pair similar times the timestamp is rounded down to the nearest 30s and paired with match
                        if (entry['location']['id'] == entry_two['location']['id']) and (
                                entry['sensor']['id'] != entry_two['sensor']['id']) and (
                                floor_date_2(parse(entry['timestamp'])) == floor_date_2(parse(entry_two['timestamp']))):
                            # -------------------TEST PRINTS------------------------------------------------------------------------------

                            print("sensor location:        ", entry['location']['id'])
                            print("sensor type:        ", entry['sensor']['sensor_type']['name'], "   sensor:        ",
                                  entry['sensor']['id'], "     timestamp:     ", entry['timestamp'])
                            print("sensor type:        ", entry_two['sensor']['sensor_type']['name'],
                                  "   sensor:        ", entry_two['sensor']['id'], "     timestamp:     ",
                                  entry_two['timestamp'])
                            print("\n")
                            # ------------------------------------------------------------------------------------------------------------

                            # insert them into database
                            self.__insert_info_pairs(entry, entry_two)
                            self.__insert_readings_pairs(entry, entry_two)

                            # once used add to used list
                            used_entry.append(entry['id'])
                            used_entry.append(entry_two['id'])


                            # -------------------TEST PRINTS------------------------------------------------------------------------------
                            print("particle entry:      ", entry,"\n")
                            print("weather entry:      ", entry_two)
                            print("------------------------------------------------------------------------------------------------------------")

                            

            print("\nTEST PRINT FOR PAIRED SENSORS\n")
            print("------------------------------------------------------------------------------------------------------------")
            # ------------------------------------------------------------------------------------------------------------

            # insert the remaining sensors that are missing either a weather or particle sensor
            for entry in s_data:
                if entry['id'] not in used_entry:
                    self.__insert_info(entry)
                    self.__insert_readings(entry)

                    # -------------------TEST PRINTS------------------------------------------------------------------------------
                    
                    print("entry:      ", entry)
                    print("------------------------------------------------------------------------------------------------------------")

                    # ------------------------------------------------------------------------------------------------------------

        print("update complete...")
        # print(list(db_query(db_info)))

    # algorithm to correct pm25
    @staticmethod
    def __normalise_pm25(pm25, hum):
        return pm25 / (1.0 + 0.48756 * pow((hum / 100.0), 8.60068))

    # algorithm to correct pm10
    @staticmethod
    def __normalise_pm10(pm10, hum):
        return pm10 / (1.0 + 0.81559 * pow((hum / 100.0), 5.83411))


def main():
    # aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"

    # dug = SensorDataHandler("57.23,-2.36,57.07,-2.04", "mongodb://localhost:27017/", "AirBDN")

    # dug.mongo_update_info()

    # pprint(mongo_update_info(aberdeen_box))
    return ()


if __name__ == '__main__':
    main()
