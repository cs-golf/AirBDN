from datetime import datetime, timedelta, date
from dateutil.parser import parse
import time
from pymongo import MongoClient
import csv
import json
from pprint import pprint
import requests

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info
db_readings = db.readings


def round_timestamp(ts, resolution_in_minutes=5):
    if resolution_in_minutes:
        ts = ts - ts % (60*resolution_in_minutes)
    return(ts)


def floor_time(dt, resolution_in_minutes=5):
    if resolution_in_minutes:
        dt = dt - timedelta(minutes=(int(dt.minute) %
                                     resolution_in_minutes)) - timedelta(seconds=dt.second)
    return(dt)


def get_raw_info(box):
    # takes box = 'lat_0,long_0,lat_1,long_1'
    # gets luftdaten data for all sensors within a given lat/log box
    try:
        requests.get(
            f"https://api.luftdaten.info/v1/filter/box={box}").raise_for_status()
        # example link = https://api.luftdaten.info/v1/filter/box=57.23,-2.36,57.07,-2.04
    except:
        print(f"    error: could not get info from luftdaten API")
        return(False)
    else:
        raw_info = requests.get(
            f"https://api.luftdaten.info/v1/filter/box={box}").json()
        return(raw_info)


def mongo_update_info(box):
    # takes box = 'lat_0,long_0,lat_1,long_1'
    # gets luftdaten data for all sensors within a given lat/log box
    # updates db_info = [ {'_id': '11991', 'lat': 57.15, 'lon': -2.134, 'sensors': {'DHT22': 23629...}}... ]
    # returns db_info
    def parse_to_mongo(entry):
        db_info.update_one(
            {"_id": str(entry['location']['id'])},
            {'$set': {"lat": round(float(entry['location']['latitude']), 3),
                      "lon": round(float(entry['location']['longitude']), 3),
                      f"sensors.{entry['sensor']['sensor_type']['name']}":  entry['sensor']['id']
                      #   f"recent_values.{entry['sensor']['sensor_type']['name']}":  entry['sensor']['id']
                      }},
            upsert=True
        )
        for value in entry["sensordatavalues"]:
            db_info.update_one(
                {"_id": str(entry['location']['id'])},
                {'$set': {f"recent_values.{value['value_type']}":  value['value']
                          }},
                upsert=True
            )
        return()

    for entry in get_raw_info(box):
        parse_to_mongo(entry)

    return(list(db_info.find()))


def get_raw_readings(name_id, date):
    # takes name_id = {name}_sensor_{id} & date = 2019-12-25
    # returns csv in form [[row],[row]...]
    # returns false if fails
    csv_url = f"http://archive.luftdaten.info/{date}/{date}_{name_id}.csv"
    # example link - http://archive.luftdaten.info/2019-12-23/2019-12-23_dht22_sensor_22550.csv
    try:
        requests.get(csv_url).raise_for_status()
    except:
        print(
            f"    {date}_{name_id} - error: could not get readings from luftdaten API")
        return(False)
    else:
        response = requests.get(csv_url).content.decode('utf-8')
        raw_readings = list(csv.reader(response.splitlines(), delimiter=';'))
        return(raw_readings)


def mongo_update_readings(name_id, day):
    # takes name_id = {name}_sensor_{id} & date = 2019-12-25
    # returns parsed readings with bucketing

    def parse_to_mongo(headings, row):
        db_readings.update_one(
            {"date": str(parse(row[5]).date()),
             "time": str(floor_time(parse(row[5])).time())
             },
            {'$set': {"date": str(parse(row[5]).date()),
                      "time": str(floor_time(parse(row[5])).time())
                      }},
            upsert=True
        )
        for i, key in enumerate(headings[6:]):
            i += 6
            if row[i]:
                if row[i] != 'nan':
                    db_readings.update_one(
                        {"date": str(parse(row[5]).date()),
                         "time": str(floor_time(parse(row[5])).time())
                         },
                        {"$set": {f"{row[2]}.{key}": row[i]}},
                        upsert=True
                    )

    raw_readings = get_raw_readings(name_id, day)
    # raw_readings = [[headings],[row],[row]...]

    if raw_readings:
        for row in raw_readings[1:]:
            parse_to_mongo(raw_readings[0], row)
        return(list(db_readings.find()))
    else:
        return(False)


def mongo_mass_update_readings(box, start_date, no_of_days=1):
    # takes box = 'lat_0,long_0,lat_1,long_1', start_date = 2019-12-02
    # calls mongo_update_readings(name_id, current_date)
    #               for each name_id within box,
    #               for each date between start_date and start_date+no_of_days
    # returns list( db_readings.find() )

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
    for i, name_id in enumerate(url_list):
        print(f"updating {name_id} {i}/{len(url_list)}")
        for i in range(no_of_days):
            current_date = str((start_date + timedelta(days=i)).date())
            print(f"    updating {name_id} {current_date}")
            mongo_update_readings(name_id, current_date)
    print("> Finished mass update.")

    return(list(db_readings.find()))


def main():
    aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"

    pprint(mongo_update_info(aberdeen_box))
    ## pprint( mongo_mass_update_readings(aberdeen_box, "2019-12-1", 31) )

    return()


if __name__ == '__main__':
    main()
