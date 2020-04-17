# exctracting data from https://www.timeanddate.com/weather/uk/aberdeen/
import requests
import re
import typing
from bs4 import BeautifulSoup as soup
import contextlib
from selenium import webdriver
import time

# extracting the table off the page


class Scrape:
    def __init__(self, city, yearStart, yearEnd):
        self.city = city
        self.yearStart = yearStart
        self.yearEnd = yearEnd
        self.driver = webdriver.Chrome('E:/chromedriver.exe')

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

    def execute(self):
        # year , month change by changing url
        for year in range(self.yearStart, self.yearEnd):
            for month in range(1, 12):
                try:
                    data_collection = {}
                    self.driver.get('https://www.timeanddate.com/weather/uk/'+self.city+'/historic?month=' +
                                    str(month) + '&year='+str(year))
                # changing js button selection
                    for i in self.driver.find_element_by_id('wt-his-select').find_elements_by_tag_name('option'):
                        i.click()
                        with self.get_weather_data(self.driver.page_source, False) as weather:
                            data_collection[i.text] = weather
                    for date, raw_data in data_collection.items():
                        for data in raw_data[('Conditions', 'Comfort')]:
                            data['date'] = date
                            print(data)
                            # here push data in mongo db
                            # data is a small json format element to push in
                except:
                    print("An exception occurred")


# name city  years between scraping for dateandtime.com
p1 = Scrape("aberdeen", 2014, 2020)
p1.execute()


