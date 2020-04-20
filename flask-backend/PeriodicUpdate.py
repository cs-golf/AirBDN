from SensorDataHandler import SensorDataHandler
from config import luftdaten_area_box
import time
from threading import Thread
import datetime


class PeriodicUpdate(Thread):
    def run(self):
        starttime = time.time()
        SDH = SensorDataHandler(luftdaten_area_box, 'mongodb+srv://AirBDN:AirBDN@airbdn-lwnqz.mongodb.net/test?retryWrites=true&w=majority', 'airbdn')

        while True:
            print(f"{time.time()}: updating data for boundary {luftdaten_area_box}")
           

            SDH.mongo_update_info()
            print(datetime.datetime.now())
            # print("timer started")
            time.sleep(300 - ((time.time() - starttime) % 300))
            # print("timer finished")
