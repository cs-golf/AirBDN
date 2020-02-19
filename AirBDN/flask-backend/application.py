from flask import Flask, Response
from bson.json_util import dumps
from dateutil.parser import parse

from db.mongo import db_info, db_readings, db_query
from periodic_update import update_thread
from config import luftdaten_area_box

update_thread.start()
application = Flask(__name__)


def get_info():
    output = dumps(db_query(db_info))
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
    output = dumps(db_query(db_readings, filter_dict))
    return Response(output,  mimetype='application/json')


application.add_url_rule('/api/info', 'info', get_info)
application.add_url_rule('/api/readings/sensor=<sensor>/start=<start>/end=<end>',
                         'readings', get_readings)


if __name__ == "__main__":
    application.run(port=1111)
