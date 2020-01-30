from flask import Flask, render_template, url_for, flash, redirect, jsonify
import sys
import json
from pymongo import MongoClient
from bson.json_util import loads, dumps
# from forms import RegistrationForm
from to_mongo import *


app = Flask(__name__)

app.config['SECRET_KEY'] = '6f335a3fe151ec9616de486cd7f9cbc3'
# Create a connection to a local MongoDB server
myclient = MongoClient("mongodb://localhost:27017/")
# Create a database c
raw = myclient["rawdata"]
mydb = myclient["parseddata"]
data = mydb["data"]

sensor_info_list = []
sensor_list = get_all_ids()
# for sensor in sensor_list:
# 	s = raw[sensor]
# 	s_info = s.find_one()
# 	sensor_info_list.append(s_info[sensor]["info"])
# sensor_info_dict = dict(zip(sensor_list, sensor_info_list))
# raw_11441 = dumps(raw["11441"].find({}))


# home page with map
@app.route("/")
@app.route("/home")
def home():
    # sensor_info_dict=sensor_info_dict
    return render_template('home.html', sensor_list=sensor_list)

# about / info page
@app.route("/about")
def about():
    return render_template('about.html')

# download page for data
@app.route("/download")
def download():
    return render_template('download.html')

# mailing list page
# @app.route("/alerts", methods=['GET', 'POST'])
# def alerts():
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         flash(f'{form.email.data} will now receive alerts!', 'success')
#         return redirect(url_for('home'))
#     return render_template('alerts.html', form=form)


@app.route('/info', methods=['GET'])
def get_all_points():
    get_raw_points = get_all_coordinates()
    list_coordinates = []
    for data in get_raw_points:
        list_coordinates.append({'location_id': data['location_id'],
                                 'coords': [data['latitude'], data['longitude']]})
    print(list_coordinates)
    return render_template('info.html',  list_coordinates=list_coordinates)

# sensor data dump
@app.route("/sensor/<sensor_id>")
def sensor_info(sensor_id):
    return render_template('sensor.html', sensor_dump=data.find_one({"location_id": sensor_id}))


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(sys.argv[1]))
