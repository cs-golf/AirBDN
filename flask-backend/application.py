from flask import Flask, Response
from flask_cors import CORS
from bson.json_util import dumps
from dateutil.parser import parse

from DatabaseHandler import DatabaseHandler
from PeriodicUpdate import PeriodicUpdate
from config import luftdaten_area_box

db = DatabaseHandler("mongodb://localhost:27017/", "AirBDN")
t = PeriodicUpdate()
t.start()

application = Flask(__name__)
CORS(application)


def get_info():
    output = dumps(db.query(db.pyinfo))
    return Response(output,  mimetype="application/json")


def get_readings(sensor="any", start="any", end="any"):
    filter_dict = {}
    if sensor != "any":
        filter_dict["location_id"] = int(sensor)
    if start != "any" or end != "any":
        filter_dict["timestamp"] = {}
        if start != "any":
            filter_dict["timestamp"]["$gte"] = parse(start)
        if end != "any":
            filter_dict["timestamp"]["$lt"] = parse(end)
    print(filter_dict)
    output = dumps(db.query(db.pyreadings, filter_dict))
    return Response(output,  mimetype='application/json')


def index():
    return '<h1>TUTORIAL FOR API HERE</h1><p>/api/info</p><p>/api/readings/sensor=<sensor>/start=<start>/end=<end></p>'


application.add_url_rule('/', "index", index)
application.add_url_rule('/api/info', 'info', get_info)
application.add_url_rule('/api/readings/sensor=<sensor>/start=<start>/end=<end>',
                         'readings', get_readings)


if __name__ == "__main__":
    application.run(port=1111)
