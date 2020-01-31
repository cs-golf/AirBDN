# @app.route("/sensor/<sensor_id>")
# def sensor_info(sensor_id):
#     return render_template('sensor.html', sensor_dump=data.find_one({"location_id": sensor_id}))

import json
from flask import Flask
from flask import Response
from pymongo import MongoClient
from bson.json_util import dumps

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info
db_readings = db.readings

app = Flask(__name__)

@app.route("/api/info")
def get_map():
    output = list(db_info.find())
    return Response(dumps(output),  mimetype='application/json')

@app.route("/api/date/<date>")
@app.route("/api/time/<time>")
@app.route("/api/datetime/<date>/<time>")
@app.route("/api/readingstest")
def get_readings():
    output = list(db_readings.find().limit(20))
    return Response(dumps(output),  mimetype='application/json')


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=int(sys.argv[1]))
    app.run(port=1111)
