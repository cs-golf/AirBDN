from pymongo import MongoClient

class DatabaseHandler:
    def __init__(self, url, db_name):

        try:
            from SECRET import uri
        except ImportError:
            pass
        self.__url = url
        self.__db = MongoClient(self.__url)[db_name]
        self.pyinfo = self.__db.info
        self.pyreadings = self.__db.readings
        self.pyweather = self.__db.weather
        self.pycontact = self.__db.contact

    @staticmethod
    def insert(target_db, filter_dict, insert_dict):
        target_db.update_one(filter_dict, {'$set': insert_dict}, upsert=True)

    @staticmethod
    def query(target_db, filter_dict={}):
        return target_db.find(filter_dict).sort([("timestamp", -1)])
    
    @staticmethod
    def queryr(target_db, filter_dict={},return_dict={}):
        return target_db.find(filter_dict, return_dict)
