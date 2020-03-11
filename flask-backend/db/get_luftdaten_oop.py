import datetime
import time

from dateutil.parser import parse
import json
import requests
# from pprint import pprint

from query_scripts import floatify, floor_date, floor_date_2
from config import luftdaten_dictionary
from mongo import db_insert, db_query, db_info, db_readings
from pymongo import MongoClient

from bs4 import BeautifulSoup
from bson.json_util import dumps
import pandas as pd

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

    def correct_data(self):



        self.__data = dumps(db_query(db_info))


        print("\n correct data dump",self.__data)


    def insert_info(self, particle_entry, weather_entry):


        db_insert(db_info, {"_id": particle_entry['location']['id']},
                  {"lat": round(floatify(particle_entry['location']['latitude']), 3),
                   "lon": round(floatify(particle_entry['location']['longitude']), 3),
                   f"sensors.{particle_entry['sensor']['sensor_type']['name']}": particle_entry['sensor']['id']})

        for reading in particle_entry["sensordatavalues"]:
            #print(reading)
            db_insert(db_info, {"_id": particle_entry['location']['id']},
                      {f"recent_values.{luftdaten_dictionary[reading['value_type']]}": floatify(reading['value'])})

            # if reading['value_type'] == "P1":
            #     db_insert(db_info, {"_id": entry['location']['id']}, {
            #         f"recent_values.norm_{luftdaten_dictionary[reading['value_type']]}": round(
            #             float(self.normalise_pm10(floatify(reading['value']), self.__humidity)), 2)})

        if particle_entry['sensor']['sensor_type']['name'] == "DHT22":
            db_insert(db_info, {"_id": particle_entry['location']['id']}, {"recent_values.corr_humidity": self.__humidity})

    # for each reading inset into the readings database
    @staticmethod
    def insert_readings(entry):
        for reading in entry['sensordatavalues']:
            db_insert(db_readings,
                      {"location_id": entry['location']['id'], "timestamp": floor_date(parse(entry['timestamp']))},
                      {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

            #print(floor_date(parse(entry['timestamp'])))



    def mongo_update_info(self):
        if self.__data:
            paired_entry = []

            # for each entry in data pair the weather sensor with the particle sensor then add it to the paired entry so is not looped over again
            for entry in self.__data:
                if entry['sensor']['sensor_type']['name'] == "SDS011" and entry['id'] not in paired_entry:
                    for entry_two in self.__data:
                        # where sensor location is the same, sensor id is different and timestamp is the same/similar
                            # to pair similar times the timestamp is rounded down to the nearest 10s and paired with match
                        if (entry['location']['id'] == entry_two['location']['id']) and (entry['sensor']['id'] != entry_two['sensor']['id']) and (floor_date_2(parse(entry['timestamp'])) == floor_date_2(parse(entry_two['timestamp']))):

                            # -------------------TEST PRINTS----------------------
                            print("sensor location:        ", entry['location']['id'])
                            print("sensor type:        ", entry['sensor']['sensor_type']['name'],"   sensor:        ", entry['sensor']['id'])
                            print("sensor type:        ", entry_two['sensor']['sensor_type']['name'],"   sensor:        ", entry_two['sensor']['id'])
                            print("entry timestamp:     ", parse(entry['timestamp']), "        entry_2 timestamp:     ", entry_two['timestamp'],"\n")


                            paired_entry.append(entry['id'])
                            paired_entry.append(entry_two['id'])

                            self.insert_info(entry, entry_two)






                print( "Entry:      ", entry,"\n")

                self.insert_readings(entry)


        #print(list(db_query(db_info)))

    def normalise_pm25(self, pm25, humidity):
        return pm25 / (1.0 + 0.48756 * pow((humidity / 100.0), 8.60068))

    def normalise_pm10(self, pm10, humidity):
        return pm10 / (1.0 + 0.81559 * pow((humidity / 100.0), 5.83411))


class HumidityScrape:

    def __init__(self, date):
        self.__date = date
        self.__url = f"https://www.metoffice.gov.uk/weather/forecast/gfnt07u1s#?date={self.__date}"
        response = requests.get(self.__url)
        self.__html = response.content
        self.__soup = BeautifulSoup(self.__html, "html.parser")
        self.humidity = self.get_humidity()

    def set_date(self, date):
        self.__date = date

    def get_humidity(self):
        return int(self.__soup.find('span', {'class': 'humidity'}).text.replace('%', ''))


def main():
    # aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"
    hum = HumidityScrape("2020-02-13")

    dug = SensorDataHandler("57.17,-2.13,57.16,-2.11", hum.get_humidity())

    dug.get_raw_data()
    dug.mongo_update_info()

    # pprint(mongo_update_info(aberdeen_box))
    return ()


if __name__ == '__main__':
    main()
