from dateutil.parser import parse
from datetime import timedelta, date, datetime
import requests
# from pprint import pprint

from query_scripts import floatify, floor_date
from config import luftdaten_dictionary
from DatabaseHandler import DatabaseHandler
from HumidityScrape import HumidityScrape
from SensorScrape import SensorScrape


from pprint import pprint


class ArcSensorDataHandler:
    def __init__(self, area, db):
        self.__area = area

        self.__s_scaper = SensorScrape(self.__area)

        self.__db = db

    # inserts to database
    def __parse_to_mongo(self, headings, row):
        for i, key in enumerate(headings[6:]):
            i += 6
            if row[i] and row[i] != 'nan':
                self.__db.insert(self.__db.pyreadings,
                                 {"location_id": int(row[2]), "timestamp": floor_date(parse(row[5]))},
                                 {f"{luftdaten_dictionary[key]}": floatify(row[i])})
        

        # check if its a faulty weather sensor and finds  correct value of similar time 
        try:
            if row[1] == "DHT22":
                time = parse(row[5])
                true_hum = self.__db.pyweather.find_one({"Date": {
                "$gte": time-timedelta(hours=0, minutes=15),
                "$lt": time+timedelta(hours=0, minutes=15)}}, { "Humidity": 1 })

                
                self.__db.insert(self.__db.pyreadings,
                                {"location_id": int(row[2]), "timestamp": floor_date(parse(row[5]))},
                                {"true_humidity": int(true_hum["Humidity"])})
        except:
            pass
            

    def __mongo_update_readings_day(self, sensor_name_id, day):
        # takes sensor_name_id = {name}_sensor_{id} & date = 2019-12-25
        # returns parsed readings with bucketing

        # raw_readings = [[headings],[row],[row]...]
        raw_readings = self.__s_scaper.get_raw_readings(sensor_name_id, day)
        pprint(raw_readings)
        if raw_readings:
            for row in raw_readings[1:]:
                self.__parse_to_mongo(raw_readings[0], row)
            return (list(self.__db.query(self.__db.pyreadings)))
        else:
            return (False)

    def mongo_mass_update_readings(self, start_date, no_of_days=1):
        # takes box = 'lat_0,long_0,lat_1,long_1', start_date = 2019-12-02
        # calls mongo_update_readings_day(sensor_name_id, current_date)
        #               for each sensor_name_id within box,
        #               for each date between start_date and start_date+no_of_days
        # returns db_readings

        url_list = self.__s_scaper.get_sensor_url_list()
        start_date = parse(start_date)

        print("> Starting mass update...")
        for i, sensor_name_id in enumerate(url_list):
            print(f"updating {sensor_name_id} {i + 1}/{len(url_list)}")
            for i in range(no_of_days):
                current_date = str((start_date + timedelta(days=i)).date())
                print(f"    updating {sensor_name_id} {current_date}")
                self.__mongo_update_readings_day(sensor_name_id, current_date)
        print("> Finished mass update.")

        return list(self.__db.query(self.__db.pyreadings))


def main():
    return()

if __name__ == '__main__':
    main()
