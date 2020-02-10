<<<<<<< Updated upstream
from get_luftdaten_api import mongo_update_info
=======
from db.luftdaten_get_api import mongo_update_info
from config import luftdaten_area_box
>>>>>>> Stashed changes
import time

aberdeen_box = "57.23,-2.36,57.07,-2.04"
starttime = time.time()

while True:
    print("updating data")
    mongo_update_info(aberdeen_box)
    time.sleep(150 - ((time.time() - starttime) % 150))
