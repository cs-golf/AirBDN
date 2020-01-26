from get_luftdaten_archive import mongo_update_info
import time

aberdeen_box = "57.23,-2.36,57.07,-2.04"
starttime = time.time()

while True:
    mongo_update_info(aberdeen_box)
    time.sleep(300.0 - ((time.time() - starttime) % 300.0))
