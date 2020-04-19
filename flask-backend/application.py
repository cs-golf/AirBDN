from flask import Flask, Response, request
from flask_cors import CORS
from bson.json_util import dumps
from dateutil.parser import parse

from db.mongo import db_info, db_readings, db_contact, db_query, db_insert
from periodic_update import update_thread
from config import luftdaten_area_box

application = Flask(__name__)
CORS(application)


def index():
    return "<p>visit <a href='https://airbdn-api.herokuapp.com/info'>/info</a> for general sensor information and latest readings</p><p>visit <a href='https://airbdn-api.herokuapp.com/readings?after=2020-1-1&before=2020-01-02'>/readings?after={YYYY-MM-DD}&before={YYYY-MM-DD}&sensorid={ID}</a> for all readings, query by time and sensorid</p><p>visit <a href='https://airbdn-api.herokuapp.com/stream/readings?after=2020-1-1&before=2020-01-02'>/stream/readings?after={YYYY-MM-DD}&before={YYYY-MM-DD}&sensorid={ID}</a> same as above but in form of a http stream</p>"


def get_info():
    output = dumps(db_query(db_info))
    return Response(output,  mimetype="application/json")


def stream_readings():
    filter_dict = {}
    sensorid = request.args.get('sensorid')
    start = request.args.get('after')
    end = request.args.get('before')
    if sensorid:
        filter_dict["location_id"] = int(sensorid)
    if start or end:
        filter_dict["timestamp"] = {}
        if start:
            filter_dict["timestamp"]["$gte"] = parse(start)
        if end:
            filter_dict["timestamp"]["$lt"] = parse(end)

    def generate():
        for reading in db_query(db_readings, filter_dict):
            yield dumps(reading) + '\n'

    return Response(generate(),  mimetype='application/json')


def get_readings():
    filter_dict = {}
    sensorid = request.args.get('sensorid')
    start = request.args.get('after')
    end = request.args.get('before')
    if sensorid:
        filter_dict["location_id"] = int(sensorid)
    if start or end:
        filter_dict["timestamp"] = {}
        if start:
            filter_dict["timestamp"]["$gte"] = parse(start)
        if end:
            filter_dict["timestamp"]["$lt"] = parse(end)
    output = dumps(db_query(db_readings, filter_dict))
    return Response(output,  mimetype='application/json')


def post_contact():
    email = request.values.get("email")
    number = request.values.get("number")
    db_insert(db_contact, {"email": email, "number": number}, {
              "email": email, "number": number})
    return "Contact details submitted"


application.add_url_rule('/', "index", index)
application.add_url_rule('/info', 'info', get_info)
application.add_url_rule('/readings', 'readings', get_readings)
application.add_url_rule(
    '/stream/readings', 'stream_readings', stream_readings)
application.add_url_rule('/contact', 'contact', post_contact, methods=['POST'])


if __name__ == "__main__":
    application.run(port=1111)
    update_thread.start()
