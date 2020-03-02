from pymongo import MongoClient

class Sensor:
    def __init__(self, _id, lat, lon):
        self._id = _id
        self.lat = lat
        self.lon = lon

def sensor_constructor():
    
    db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
    db_info = db.info

    sensor_list = list()
    for sensor in db_info.find():
        sensor_list.append(Sensor(sensor["_id"], sensor["lat"], sensor["lon"]))
    
    return sensor_list