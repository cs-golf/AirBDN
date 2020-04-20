from dateutil.parser import parse
import json
import requests
from pprint import pprint
import urllib3
from re import split
from datetime import datetime, timedelta

from db.mongo import db_insert, db_query, db_info, db_readings
from db.query_scripts import floatify, floor_date
from config import luftdaten_dictionary
from functools import reduce


def reverse_geocode(lat, lon):
    resp = requests.get(
        f"https://eu1.locationiq.com/v1/reverse.php?key=8d93b743dac638&lat={lat}&lon={lon}&format=json").json()
    if "display_name" not in resp:
        return
    addr = resp['address']
    return(f"{addr['road']}, {addr['suburb']}")


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
    def db_insert_info(entry):
        db_insert(db_info, {"_id": entry['location']['id']},
                  {"lat": round(floatify(entry['location']['latitude']), 3),
                   "lon": round(floatify(entry['location']['longitude']), 3),
                   f"sensors.{entry['sensor']['sensor_type']['name']}":  entry['sensor']['id']})

        for reading in entry["sensordatavalues"]:
            db_insert(db_info, {"_id": entry['location']['id']},
                      {f"recent_values.{luftdaten_dictionary[reading['value_type']]}":  floatify(reading['value'])})

        # adds 24 hr averages of pm10 and pm25 to recent_values
        if entry['sensor']['sensor_type']['name'] == "SDS011":

            yesterday = datetime.today() - timedelta(days=1)
            last24hrs = list(db_query(db_readings, {"location_id": entry['location']['id'],
                                                    "timestamp": {"$gt": yesterday}}))

            pm10_24hr = reduce(lambda r1, r2: {'pm10': r1['pm10'] + r2['pm10']},
                               filter(lambda r: "pm10" in r, last24hrs))['pm10'] / len(last24hrs)
            pm25_24hr = reduce(lambda r1, r2: {'pm25': r1['pm25'] + r2['pm25']},
                               filter(lambda r: "pm25" in r, last24hrs))['pm25'] / len(last24hrs)

            db_insert(db_info, {"_id": entry['location']['id']},
                      {"recent_values.pm10_24hr": pm10_24hr,
                       "recent_values.pm25_24hr": pm25_24hr})

        # adds a display name to db entry
        reading = list(db_query(db_info, {"_id": entry['location']['id']}))[0]
        if "display_name" not in reading:
            # looks up through a free service what address corresponds to [lat, lon]
            display_name = reverse_geocode(reading["lat"], reading["lon"])
            # due to free service limits, may return an error, hence the 'if'
            if display_name:
                db_insert(db_info, {"_id": entry['location']['id']},
                          {"display_name": display_name})

    def db_insert_readings(entry):
        for reading in entry['sensordatavalues']:
            db_insert(db_readings, {"location_id": entry['location']['id'], "timestamp": floor_date(parse(entry['timestamp']))},
                      {luftdaten_dictionary[reading['value_type']]: floatify(reading['value'])})

    raw_info = get_raw_info(box)
    if raw_info:
        for entry in raw_info:
            db_insert_info(entry)
            db_insert_readings(entry)

    return(list(db_query(db_info)))


def main():
    return()


if __name__ == '__main__':
    main()
