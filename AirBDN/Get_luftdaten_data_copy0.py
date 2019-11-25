from bs4 import BeautifulSoup
import os.path
import pprint
import requests
from datetime import datetime, tzinfo, timezone, date, timedelta
from dateutil import parser
import os, argparse, csv, json, glob
from pymongo import MongoClient

sensorvalues = ['P1', 'durP1', 'ratioP1', 'P2', 'durP2', 'ratioP2',
                'humidity', 'temperature', 'pressure', 'pressure_at_sealevel']
file_directory = './data/big_dump/'
old_directory = 'data/big_dump/old/'
done_csv = 'data/big_dump/donecsv/'


def parse_final(location_id):
    with open(old_directory + location_id + '.json', 'r') as f:
        datastore = json.load(f)
        list_of_dics = [
            value for value in datastore[location_id]["readings"].values()]
        newdata = {"location_id":datastore[location_id]["info"]["location_id"],
                   "latitude":datastore[location_id]["info"]["latitude"],
                   "longitude":datastore[location_id]["info"]["longitude"],
                   "readings": []}
        newdata["readings"] = list_of_dics
        with open('data/big_dump/parsedJsons/' + location_id + '.json', 'w') as file:
            file.write(json.dumps(newdata, indent=4, sort_keys=True))


def final_every_sensor():
    for filename in os.listdir(old_directory):
        print(" Final Parsing next file...", filename)
        parse_final((filename)[:-5])


def get_historic_data(current_data, start_date):
    # Download data for each sensor.
    # start from 48hrs before today and workbackwards
    start_date = start_date - timedelta(days=450)

    for sensor in current_data:
        point_date = start_date
        # sensor flag is true until either:
        # 1. file already exits
        # 2. file cannot be downloaded (i.e. doesn't exists on pyserver)
        sensor_flag = True
        while (sensor_flag == True):
            # construct file name
            str_date = point_date.isoformat()
            filename = str_date + '_' + sensor['sensor']['sensor_type']['name'].lower(
            ) + '_sensor_' + str(sensor['sensor']['id'])+'.csv'
            full_link = 'http://archive.luftdaten.info/' + str_date + '/' + filename

            # check if file has already been downloaded
            if not (os.path.isfile(old_directory + filename)):
                with open(file_directory + 'list.txt', 'r') as f:

                    if (filename in f.read()):
                        # file exists, skip
                        sensor_flag = False
                    else:
                        # file does not exist. Proceed to try download.
                        sensor_flag = downloader(full_link, filename)
            # point_date moves back a day
            point_date = point_date - timedelta(days=1)


def downloader(full_link, name):
    fname = file_directory + name
    try:
        r = requests.get(full_link)
        r.raise_for_status()
    except:
        print('  ', name, 'ERROR: Could not download file')
        return(False)

    else:
        # Save the string to a file
        r = requests.get(full_link, stream=True)
        with open(fname, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)
        print('  ', name, '- complete')
        return(True)


def get_data(box):
    # gets luftdaten data for all sensors within a given lat/log box
    # box = 'lat_0,long_0,lat_1,long_1'
    r = requests.get('https://api.luftdaten.info/v1/filter/box=' + box)
    my_json = r.json()
    return my_json


def MrParsy():
    format = "pretty"
    input_directory = file_directory
    if ((input_directory[-1:] != '\\') & (input_directory[-1:] != '/')):
        input_directory = input_directory + "\\"
    file_list = glob.iglob(input_directory + '*.csv')
    for input_file in file_list:
        print("Parsing next file...", input_file)
        read_csv(input_file, input_directory, format)


def read_csv(file, json_file, format):
    csv_rows = []
    with open(file) as csvfile:
        dictionary = csv.DictReader(csvfile, delimiter=";")
        title = dictionary.fieldnames
        for row in dictionary:
            csv_rows.extend([{title[i]:row[title[i]]
                              for i in range(len(title))}])
        tidy_dict = tidy_values(csv_rows)
        #pp = pprint.PrettyPrinter(indent=1)
        # pp.pprint(tidy_dict)
    write_json(tidy_dict, json_file, format)
    newfile = file.replace("./data/big_dump", done_csv)
    print(file, newfile)
    os.rename(file, newfile)


def write_json(data, json_file, format):
    location_id = list(data.keys())[0]
    d = {}
    if (os.path.isfile(json_file + 'old/' + location_id + '.json')):
        with open(json_file + 'old/' + location_id + '.json', "r") as f:
            d = json.load(f)
            d[location_id]['info'].update(
                data[location_id]['info']
            )
            for timestamp in data[location_id]['readings']:
                if (str(timestamp) in d[location_id]['readings']):
                    d[location_id]['readings'][str(timestamp)].update(
                        data[location_id]['readings'][timestamp])
                else:
                    d[location_id]['readings'].update(
                        {str(timestamp): data[location_id]['readings'][timestamp]})

        with open(json_file + 'old/' + location_id + '.json', "w") as f:
            if format == "pretty":
                f.write(json.dumps(d, sort_keys=True, indent=4))
            else:
                f.write(json.dumps(d))
            print(json_file + 'old/' + location_id + '.json' + " - updated")
            col = raw[location_id]
            r = col.update_one( {"_id":location_id}, {"$set": d}, True)
    else:
        with open(json_file + 'old/' + location_id + '.json', "w") as f:
            d[location_id] = data[location_id]
            if format == "pretty":
                f.write(json.dumps(d, sort_keys=True, indent=4))
            else:
                f.write(json.dumps(d))
            print(json_file + 'old/' + location_id + '.json' + " - created")
            col = raw[location_id]
            r = col.update_one( {"_id":location_id}, {"$set": d}, True)


def infolist():
    summary = {}
    file_list = glob.iglob(old_directory + '*.json')
    for input_file in file_list:
        if not(input_file[-9:] == 'info.json'):
            with open(input_file, "r") as f:
                d = json.load(f)
                location_id_temp = list(d.keys())[0]
                summary[location_id_temp] = {}
                summary[location_id_temp]['info'] = d[location_id_temp]['info']
    with open(file_directory + 'info.json', "w") as f:
        f.write(json.dumps(summary, sort_keys=True, indent=4))
        print(file_directory + 'info.json' + " - created")


def tidy_values(our_list):
    # organises ourlist as a dictionary of dictionaries follows:
    new_dict = {}
    location_id = str(our_list[0]['location'])
    reading = our_list[0]
    if (new_dict.get(location_id, None) == None):
        new_dict[location_id] = {}
        new_dict[location_id]['info'] = {
            'latitude': reading['lat'],
            'longitude': reading['lon'],
            'location_id': location_id
        }
        new_dict[location_id]['readings'] = {}
        for option in sensorvalues:
            if (option in reading):
                if (reading[option]):
                    new_dict[location_id]['info'].update({
                        option: {
                            reading['sensor_type']: reading['sensor_id'],
                        }
                    })

    for reading in our_list:
        reading_ts = reading['timestamp']
        if reading_ts.find('+') < 0:
            # adds timezone if none given.
            # this is required for timestamp calculation below
            reading_ts = reading_ts + '+00:00'
            reading_ts = parser.parse(reading_ts)
        timestamp = int(
            (reading_ts - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds())
        timestamp = timestamp // 360 * 360  # round to nearest minute
        new_dict[location_id]['readings'][timestamp] = {}
        for option in sensorvalues:
            if (option in reading):
                if (reading[option]):
                    new_dict[location_id]['readings'][timestamp].update({
                        'timestamp': str((timestamp)),
                        option: reading[option],
                    })
    return(new_dict)


def cleanUpCSVs():
    input_directory = file_directory
    if ((input_directory[-1:] != '\\') & (input_directory[-1:] != '/')):
        input_directory = input_directory + "\\"
    file_list = glob.iglob(done_csv + '*.csv')
    for input_file in file_list:
        with open(file_directory + 'list.txt', "a") as f:
            f.write(input_file[22:] + "\n")
            os.remove(input_file)
        print("recored & deleted", input_file)


def main():
    Aberdeen = [57.23, -2.36, 57.07, -2.04]
    test = [57.17, -2.13, 57.16, -2.11]
    box = test

    # stringify box array for use in API
    strbox = (str(box)[1:-1]).replace(" ", "")

    # Get current sensor data from luftdaten.
    print()
    print('Searching for current sensors in area...', strbox)
    current_data = get_data(strbox)
    print('Number of sensors found = ', len(current_data))

    # Pull out sensor IDs
    sensor_list = []
    for device in current_data:
        sensor_list.append(device['sensor']['id'])
    print("Looking for the following sensors:", sensor_list)
    # Get historic data for above sensors
    # Works backwards from today
    todays_date = date.today()
    print(todays_date)
    print('Getting historic data for sensors from', todays_date)
    get_historic_data(current_data, todays_date)

    # Parse new data into JSON
    print('Parsing data to JSON')
    MrParsy()
    print('Final Parsing v3')
    final_every_sensor()
    print('Building summary file...')
    infolist()
    print('Removing csvs')
    cleanUpCSVs()

    return ()


if __name__ == '__main__':
    main()
