from flask import Flask, Response
from pymongo import MongoClient
from bson.json_util import dumps

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info
db_readings = db.readings

application = app = Flask(__name__)

def get_info():
    output = list(db_info.find())
    return Response(dumps(output),  mimetype='application/json')

def get_readings():
    output = list(db_readings.find().limit(20))
    return Response(dumps(output),  mimetype='application/json')

application.add_url_rule('/api/info', 'info', get_info)
application.add_url_rule('/api/20readings', 'readings', get_readings)

if __name__ == "__main__":
    app.run(port=1111)