# exctracting data from https://www.timeanddate.com/weather/uk/aberdeen/
import requests
import re
import datetime
import typing
from bs4 import BeautifulSoup as soup
import contextlib
from selenium import webdriver
import time
from pymongo import MongoClient

# mongo initialize
client = MongoClient('localhost', 27017)
db = client['test-database']
collection = db['test-collection']

# scraping tool for historic data of Aberdeen


class Scrape:
    # initialize
    def __init__(self, country, city, yearStart):
        self.city = city
        self.yearStart = yearStart
        self.driver = webdriver.Chrome('E:/chromedriver.exe')
        self.country = country

    # scrape the HTML table of a page
    def _remove(self, d: list) -> list:
        return list(filter(None, [re.sub('\xa0', '', b) for b in d]))

    @contextlib.contextmanager
    def get_weather_data(self, url: str, by_url=True) -> typing.Generator[dict, None, None]:
        d = soup(requests.get(url).text if by_url else url, 'html.parser')
        _table = d.find('table', {'id': 'wt-his'})
        _data = [[[i.text for i in c.find_all(
            'th')], *[i.text for i in c.find_all('td')]] for c in _table.find_all('tr')]
        [h1], [h2], *data, _ = _data
        _h2 = self._remove(h2)
        yield {tuple(self._remove(h1)): [dict(zip(_h2, self._remove([a, *i]))) for [[a], *i] in data]}

    # visit each page up to date to scrape
    # controlling years & month with the url
    # while using selenium for JS in order to select a date

    def execute(self):
        now = datetime.datetime.now()
        for year in range(self.yearStart, now.year+1):
            for month in range(1, 13):
                if not ((year == now.year) and (now.month < month)):
                    try:
                        data_collection = {}
                        self.driver.get('https://www.timeanddate.com/weather/'+self.country+'/'+self.city+'/historic?month=' +
                                        str(month) + '&year='+str(year))

                        # changing js button selection to iterate though the dates
                        for i in self.driver.find_element_by_id('wt-his-select').find_elements_by_tag_name('option'):
                            i.click()
                            with self.get_weather_data(self.driver.page_source, False) as weather:
                                data_collection[i.text] = weather

                        # restructure the taken json
                        for date, raw_data in data_collection.items():
                            for data in raw_data[('Conditions', 'Comfort')]:
                                data['Time'] = data['Time'][:5]
                                # print(time.strptime(
                                #     str(data['Time']) + ' ' + str(date), "%H:%M %d %B %Y"))
                                data['Date'] = time.strptime(
                                    str(data['Time']) + ' ' + str(date), "%H:%M %d %B %Y")
                                data['Humidity'] = data['Barometer']
                                data['Barometer'] = data['Visibility']
                                del data['Visibility']
                                del data['Time']
                                print(data)
                                collection.insert_one(data)
                                # here push data in mongo db
                                # data is a small json format element to push in
                    except:
                        print("An exception occurred")
        print("work finished")


# name city  years between scraping for dateandtime.com
p1 = Scrape('uk', 'aberdeen', 2019)
p1.execute()
