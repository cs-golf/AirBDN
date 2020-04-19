import requests
import csv

class SensorScrape:

    def __init__(self, area):
        self.__area = area

    def set_area(self, area):
        self.__area = area

    def get_raw_info(self):
        try:
            requests.get(
                f"https://api.luftdaten.info/v1/filter/box={self.__area}").raise_for_status()
        except:
            print(f"    error: could not get info from luftdaten API")
            return None
        else:
            return requests.get(f"https://api.luftdaten.info/v1/filter/box={self.__area}").json()

    def get_raw_readings(self, sensor_name_id, date):
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


    def get_sensor_url_list(self):
        # box = 'lat_0,long_0,lat_1,long_1'
        # returns array of unique sensor ids
        # [{"sensor":...}, {"sensor":...}...]   ==>   ["{name}_sensor_{id}", "{name}_sensor_{id}"... ]
        return (list(set(map(lambda
                                 device: f"{device['sensor']['sensor_type']['name'].lower()}_sensor_{str(device['sensor']['id'])}", self.get_raw_info()))))


    