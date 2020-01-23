import pprint
from datetime import datetime, tzinfo, timezone, date, timedelta
import os, json
from pymongo import MongoClient
import pprint
import os.path

myclient = MongoClient("mongodb://localhost:27017/")
mydb = myclient["parseddata"]
data = mydb["data"]
corrected = mydb["corrected_data"]
directory = 'data/big_dump/parsedJsons/'

# all parced jsons folder in db
def pushdata():
    if(data.count_documents({})== 0):
        for filename in os.listdir(directory):        
                with open( directory + filename , 'r') as f:
                    datastore = json.load(f)
                    m = data.insert_one(datastore)
                    print("pushed")

def query_collection(collection, unwind, key, param):
    #"colection" is the collection to query
    #"unwind" is the dictionary to query as a string
    #"key" is the key to query as a string
    #"param" is the parameter of the query as a dictionary
    
    key = unwind+"."+key
    unwind = "$"+ unwind
    
    query_param = [
        {"$unwind": unwind},
        {"$match":{key: param }},
        {"$replaceRoot":{"newRoot": unwind}}]
    cursor = collection.aggregate(query_param)
    result = list(cursor)
    return result

# all sensors data for specific time   
# how to search
def query_a_time_period(x,y):
    
    result = query_collection(data, "readings", "timestamp", {"$gt":x, "$lt":y})
    pprint.pprint(result)
    return result

def removedb():
    myclient.drop_database('parseddata')
    
    
def get_all_ids():
    location_id = data.distinct("location_id")
    print(location_id)
    return location_id
    
    
def get_all_coordinates():
    all_ids = get_all_ids()
    array = []
    for document in all_ids:
        print(data.find_one( {"location_id":document},
                            {"location_id":"true", "latitude": "true", "longitude":"true" }))
        array.append(data.find_one( {"location_id":document},
                            {"location_id":"true", "latitude": "true", "longitude":"true" }))
    return array


def correction(x):
    result = query_collection(data, "readings", "humidity", {"$gt":x})
    for doc in result:
        if "P1" in doc:
            doc["P1"] = "Correction"
        if "P2" in doc:
            doc["P2"] = "Correction"  
    print(result)

            
def print_collection_data(collection): 
    cursor = collection.find()
    result = list(cursor)
    pprint.pprint(result)
            
        
def main():   
    start_time  = "1563914100"
    finish_time = "1563914220"
    # removedb()
    pushdata()
    get_all_ids()
    get_all_coordinates()
    
    query_a_time_period(start_time,finish_time)
    correction("70")
    print_collection_data(corrected)
    
    return()


if __name__ == '__main__':
    main()
