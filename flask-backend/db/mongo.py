from pymongo import MongoClient

try:
    from SECRET import uri
except ImportError:
    uri = "mongodb://localhost:27017/"

db = MongoClient(uri)["airbdn"]

db_info = db.info
db_readings = db.readings
db_contact = db.contact


def db_insert(target_db, filter_dict, insert_dict):
    target_db.update_one(
        filter_dict,
        {'$set': insert_dict},
        upsert=True
    )


def db_query(target_db, filter_dict={}):
    return target_db.find(filter_dict).sort([("timestamp", -1)])
