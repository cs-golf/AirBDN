from flask import Flask, Response, request
from flask_cors import CORS
from bson.json_util import dumps
from dateutil.parser import parse

from DatabaseHandler import DatabaseHandler
from ArcSensorDataHandler import ArcSensorDataHandler
from WeatherScrape import WeatherScrape
from PeriodicUpdate import PeriodicUpdate
from config import luftdaten_area_box

db = DatabaseHandler("mongodb://localhost:27017/", "AirBDN")
# hds = ArcSensorDataHandler(luftdaten_area_box, db)
# hds.mongo_mass_update_readings("2020-04-18")
# ws = WeatherScrape('uk', 'aberdeen', 2020)
# ws.execute()
t = PeriodicUpdate()
t.start()

application = Flask(__name__)
CORS(application)

def index():
    return "<h1>TUTORIAL FOR API HERE</h1><p>/info</p><p>/readings?after={YYYY-MM-DD}&before={YYYY-MM-DD}&sensorid={ID}</p>"

def get_info():
    output = dumps(db.query(db.pyinfo))
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
        for reading in db.query(db.pyreadings, filter_dict):
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
    output = dumps(db.query(db.pyreadings, filter_dict))
    return Response(output,  mimetype='application/json')

def post_contact():
    email = request.values.get("email")
    number = request.values.get("number")
    db.insert(db.pycontact, {"email": email, "number": number}, {
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