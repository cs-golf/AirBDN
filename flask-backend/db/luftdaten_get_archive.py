from datetime import timedelta, date
from dateutil.parser import parse
import csv
import requests

from db.mongo import db_insert, db_query, db_info, db_readings
from db.query_scripts import floatify
from db.luftdaten_get_api import get_raw_info
from config import luftdaten_dictionary
# from pprint import pprint


def get_raw_readings(sensor_name_id, date):
    # takes sensor_name_id = {name}_sensor_{id} & date = 2019-12-25
    # returns csv in form [[row],[row]...]
    # returns false if fails
    csv_url = f"http://archive.luftdaten.info/{date}/{date}_{sensor_name_id}.csv"
    # example link - http://archive.luftdaten.info/2019-12-23/2019-12-23_dht22_sensor_22550.csv
    try:
        requests.get(csv_url).raise_for_status()
    except:
        print(
            f"    {date}_{sensor_name_id} - error: could not get readings from luftdaten API")
        return(False)
    else:
        response = requests.get(csv_url).content.decode('utf-8')
        raw_readings = list(csv.reader(response.splitlines(), delimiter=';'))
        return(raw_readings)


def mongo_update_readings_day(sensor_name_id, day):
    # takes sensor_name_id = {name}_sensor_{id} & date = 2019-12-25
    # returns parsed readings with bucketing

    def parse_to_mongo(headings, row):
        for i, key in enumerate(headings[6:]):
            i += 6
            if row[i] and row[i] != 'nan':
                db_insert(db_readings, {"location_id": int(row[2]), "timestamp": parse(row[5])},
                          {f"{luftdaten_dictionary[key]}": floatify(row[i])})

    # raw_readings = [[headings],[row],[row]...]
    raw_readings = get_raw_readings(sensor_name_id, day)

    if raw_readings:
        for row in raw_readings[1:]:
            parse_to_mongo(raw_readings[0], row)
        return(list(db_query(db_readings)))
    else:
        return(False)


def mongo_mass_update_readings(box, start_date, no_of_days=1):
    # takes box = 'lat_0,long_0,lat_1,long_1', start_date = 2019-12-02
    # calls mongo_update_readings_day(sensor_name_id, current_date)
    #               for each sensor_name_id within box,
    #               for each date between start_date and start_date+no_of_days
    # returns db_readings

    def get_sensor_url_list(box):
        # box = 'lat_0,long_0,lat_1,long_1'
        # returns array of unique sensor ids
        # [{"sensor":...}, {"sensor":...}...]   ==>   ["{name}_sensor_{id}", "{name}_sensor_{id}"... ]
        return(list(set(map(
                    lambda device: f"{device['sensor']['sensor_type']['name'].lower()}_sensor_{str(device['sensor']['id'])}",
                    get_raw_info(box)))))

    url_list = get_sensor_url_list(box)
    start_date = parse(start_date)

    print("> Starting mass update...")
    for i, sensor_name_id in enumerate(url_list):
        print(f"updating {sensor_name_id} {i+1}/{len(url_list)}")
        for i in range(no_of_days):
            current_date = str((start_date + timedelta(days=i)).date())
            print(f"    updating {sensor_name_id} {current_date}")
            mongo_update_readings_day(sensor_name_id, current_date)
    print("> Finished mass update.")

    return(list(db_query(db_readings)))


def main():
    # aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"

    # mongo_mass_update_readings("57.17,-2.13,57.16,-2.11", "2019-12-1", 1)
    return()


if __name__ == '__main__':
    main()
