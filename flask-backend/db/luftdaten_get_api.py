from dateutil.parser import parse
import json
import requests
# from pprint import pprint

from db.AQI_calc import PM25_AQI, PM10_AQI
from db.pm_correction import normalisePM10, normalisePM25
from db.humidity_scrape import get_humidity
from db.mongo import db_insert, db_query, db_info, db_readings
from db.query_scripts import floatify




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
        {"lat": round(floatify(entry['location']['latitude']), 3), "lon": round(floatify(entry['location']['longitude']), 3),f"sensors.{entry['sensor']['sensor_type']['name']}":  entry['sensor']['id']})
        current_h = get_humidity()
        if entry['sensor']['sensor_type']['name'] == "DHT22":
            # current_h = get_humidity()
            db_insert(db_info, {"_id": entry['location']['id']},
                    {"recent_values.corrected_h" : current_h})

        for reading in entry["sensordatavalues"]:
            db_insert(db_info, {"_id": entry['location']['id']},
                      {f"recent_values.{reading['value_type']}":  floatify(reading['value'])})

            if reading['value_type'] == "P1":
                db_insert(db_info, {"_id": entry['location']['id']},
                          {f"recent_values.aqi_{reading['value_type']}":  float(PM10_AQI(floatify(reading['value'])))})
            if reading['value_type'] == "P2":
                db_insert(db_info, {"_id": entry['location']['id']},
                          {f"recent_values.aqi_{reading['value_type']}":  float(PM25_AQI(floatify(reading['value'])))})
#------------------------------------------------------------------------------------------------------------------------------------#
            if reading['value_type'] == "P2":
                db_insert(db_info, {"_id": entry['location']['id']},
                          {f"recent_values.norm_{reading['value_type']}":  round(float(normalisePM10(floatify(reading['value']),current_h)),2)})


            if reading['value_type'] == "P1" and entry['sensor']['sensor_type']['name'] == "DHT22":
                db_insert(db_info, {"_id": entry['location']['id']},
                          {f"recent_values.true_norm_{reading['value_type']}":  round(float(normalisePM10(floatify(reading['value']), current_h)),2)})
            # humidity correction


            # pm10 correction

            # if reading.value_type == "P1" and reading.value_type   : # add humidity > 70
            #     db_insert(db_info, {"_id": entry['location']['id']},
            #               {f"recent_values.corrected_{reading['value_type']}":  float(normalisePM10(floatify(reading['value'])))})

            # pm25 correction


            # if reading.value_type > 70:
            #     db_insert(db_info, {"_id": entry['location']['id']},
            #               {f"recent_values.aqi_{reading['value_type']}":  float(PM25_AQI(floatify(reading['value'])))})

            # if reading.value_type == "P1" and reading.value_type   : # add humidity > 70
            #     db_insert(db_info, {"_id": entry['location']['id']},
            #               {f"recent_values.corrected_{reading['value_type']}":  float(normalisePM10(floatify(reading['value'])))})

            # if reading['value_type'] == "P2" and : # add humidity > 70
            #     db_insert(db_info, {"_id": entry['location']['id']},
            #               {recent_values.corrected_h :  get_humidity()})





#------------------------------------------------------------------------------------------------------------------------------------#
    def db_insert_readings(entry):
        for reading in entry['sensordatavalues']:
            db_insert(db_readings,
            {"location_id": entry['location']['id'],  "timestamp": parse(entry['timestamp'])},
            {reading['value_type']: floatify(reading['value'])})

    raw_info = get_raw_info(box)
    if raw_info:
        for entry in raw_info:
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
