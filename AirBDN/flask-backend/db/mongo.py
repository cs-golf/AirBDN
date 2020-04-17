from pymongo import MongoClient

db = MongoClient("mongodb://localhost:27017/")["AirBDN"]
db_info = db.info
db_readings = db.readings

def db_insert(target_db, filter_dict, insert_dict):
    target_db.update_one(
        filter_dict,
        {'$set': insert_dict},
        upsert=True
    )

def db_query(target_db, filter_dict={}):
    return target_db.find(filter_dict)