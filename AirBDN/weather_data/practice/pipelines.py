# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
# from scrapy.utils.project import get_project_settings
# settings = get_project_settings()


class MongoDBPipeline(object):
    def __init__(self):
        self.conn = pymongo.MongoClient('localhost', 27017)
        db = self.conn['data']
        self.collection = db['humid']

    def process_item(self, item, spider):
        self.collection.insert(dict(item))
        return item
