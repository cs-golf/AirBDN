from SensorDataHandler import SensorDataHandler
from config import luftdaten_area_box
import time
from threading import Thread


class PeriodicUpdate(Thread):
    def run(self):
        starttime = time.time()
        SDH = SensorDataHandler("57.23,-2.36,57.07,-2.04", "mongodb://localhost:27017/", "AirBDN")

        while True:
            print(f"{time.time()}: updating data for boundary {luftdaten_area_box}")
            SDH.mongo_update_info()
            # print("timer started")
            time.sleep(300 - ((time.time() - starttime) % 300))
            # print("timer finished")
