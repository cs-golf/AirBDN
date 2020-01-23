# @app.route("/sensor/<sensor_id>")
# def sensor_info(sensor_id):
#     return render_template('sensor.html', sensor_dump=data.find_one({"location_id": sensor_id}))

from flask import Flask
from pymongo import MongoClient

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info
db_readings = db.readings

app = Flask(__name__)


@app.route("/api/map")
def get_map():
    output = {}
    for entry in db_info.find():
        output[entry["_id"]] = {"lat_lon": [entry["lat"], entry["lon"]] 
                                # "P1": entry['recent_values']['P1'],
                                # "P2": entry['recent_values']['P2'],
                                # "humidity": entry['recent_values']['humidity'],
                                # "temp": entry['recent_values']['temperature'],
                                }
        for k, v in entry['recent_values'].items():
            output[entry["_id"]][k] = v
    return output


@app.route("/api/date/<date>")
@app.route("/api/time/<time>")
@app.route("/api/datetime/<date>/<time>")
@app.route("/api/sensor_info")
def get_sensor_info():
    output = []
    for entry in db_info.find():
        output.append(entry)
    return {'sensors': output}


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=int(sys.argv[1]))
    app.run(port=1111)
