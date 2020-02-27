import overpy_api
from geopy.distance import geodesic, great_circle
from pymongo import MongoClient
import pprint

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info

result = overpy_api.bbox_query("57.101011530769,-2.1986389160156,57.206594429377,-2.028694152832")
print(len(result.ways))
print(len(result.nodes))
print(len(result.relations))

def get_distance(sensor_coordinates, house_coordiantes):
    geo_distance = geodesic(sensor_coordinates, house_coordiantes).km
    gc_distance = great_circle(sensor_coordinates, house_coordiantes).km
    print(geo_distance, gc_distance)

for sensor in db_info.find():
    pprint.pprint(sensor)