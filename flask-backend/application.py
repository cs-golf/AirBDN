from flask import Flask, Response, request
from flask_cors import CORS
from bson.json_util import dumps
from dateutil.parser import parse

from db.mongo import db_info, db_readings, db_contact, db_query, db_insert
from periodic_update import update_thread
from config import luftdaten_area_box

update_thread.start()
application = Flask(__name__)
CORS(application)


def get_info():
    output = dumps(db_query(db_info))
    return Response(output,  mimetype="application/json")


def post_contact():
    email = request.values.get("email")
    number = request.values.get("number")
    db_insert(db_contact, {"email": email, "number": number}, {
              "email": email, "number": number})
    return "Contact details submitted"


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


def index():
    return '<h1>TUTORIAL FOR API HERE</h1><p>/api/info</p><p>/api/readings/sensor=<sensor>/start=<start>/end=<end></p>'


application.add_url_rule('/', "index", index)
application.add_url_rule('/api/info', 'info', get_info)
application.add_url_rule('/contact', 'contact', post_contact, methods=['POST'])
application.add_url_rule('/api/readings/sensor=<sensor>/start=<start>/end=<end>',
                         'readings', get_readings)


if __name__ == "__main__":
    application.run(port=1111)
