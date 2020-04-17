#exctracting data from https://www.timeanddate.com/weather/uk/aberdeen/
import requests
import re
import typing
from bs4 import BeautifulSoup as soup
import contextlib
from selenium import webdriver
import time

# extracting the table off the page
def _remove(d: list) -> list:
    return list(filter(None, [re.sub('\xa0', '', b) for b in d]))

@contextlib.contextmanager
def get_weather_data(url: str, by_url=True) -> typing.Generator[dict, None, None]:
    d = soup(requests.get(url).text if by_url else url, 'html.parser')
    _table = d.find('table', {'id': 'wt-his'})
    _data = [[[i.text for i in c.find_all(
        'th')], *[i.text for i in c.find_all('td')]] for c in _table.find_all('tr')]
    [h1], [h2], *data, _ = _data
    _h2 = _remove(h2)
    yield {tuple(_remove(h1)): [dict(zip(_h2, _remove([a, *i]))) for [[a], *i] in data]}


d = webdriver.Chrome('E:/chromedriver.exe')
data_collection = {}

#year , month change by changing url
for year in range(2014, 2020):
    for month in range(1, 12):
        d.get('https://www.timeanddate.com/weather/uk/aberdeen/historic?month=' +
              str(month) + '&year='+str(year))
#changing js button selection
        for i in d.find_element_by_id('wt-his-select').find_elements_by_tag_name('option'):
            i.click()
            with get_weather_data(d.page_source, False) as weather:
                data_collection[i.text] = weather
