from db.luftdaten_get_api import mongo_update_info
from config import luftdaten_area_box
import time

starttime = time.time()

while True:
    print(f"{time.time()}: updating data for boundary {luftdaten_area_box}")
    mongo_update_info(luftdaten_area_box)
    time.sleep(150 - ((time.time() - starttime) % 150))
