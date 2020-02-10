from dateutil.parser import parse
import json
import requests
# from pprint import pprint

from AQI_calc import PM25_AQI, PM10_AQI
from mongo import db_insert, db_query, db_info, db_readings
from query_scripts import floatify


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
                  {f"recent_values.{reading['value_type']}":  floatify(reading['value'])})
            if reading['value_type'] == "P1":
                db_insert(db_info, {"_id": entry['location']['id']},
                      {f"recent_values.aqi_{reading['value_type']}":  float(PM10_AQI(floatify(reading['value'])))})
            if reading['value_type'] == "P2":
                db_insert(db_info, {"_id": entry['location']['id']},
                      {f"recent_values.aqi_{reading['value_type']}":  float(PM25_AQI(floatify(reading['value'])))})

    def db_insert_readings(entry):
        for reading in entry['sensordatavalues']:
            db_insert(db_readings, {"location_id": entry['location']['id'], "timestamp": parse(entry['timestamp'])},
                  {reading['value_type']: floatify(reading['value'])})

    for entry in get_raw_info(box):
        db_insert_info(entry)
        db_insert_readings(entry)

    return(list(db_query(db_info)))


def main():
    # aberdeen_box = "57.23,-2.36,57.07,-2.04"
    # smaller_test_box = "57.17,-2.13,57.16,-2.11"

    # pprint(mongo_update_info(aberdeen_box))
    return()


if __name__ == '__main__':
    main()