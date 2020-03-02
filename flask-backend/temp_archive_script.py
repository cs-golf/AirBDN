from db.luftdaten_get_archive import mongo_mass_update_readings
from config import luftdaten_area_box

mongo_mass_update_readings(luftdaten_area_box, "2020-1-1", 7)
