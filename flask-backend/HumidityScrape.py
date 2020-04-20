from bs4 import BeautifulSoup
import requests
from datetime import datetime

class HumidityScrape:
    # scrapes local weather station for humidity
    def __init__(self):
        self.__date = datetime.today().strftime('%Y-%m-%d')
        self.__url = f"https://www.metoffice.gov.uk/weather/forecast/gfnt07u1s#?date={self.__date}"
        response = requests.get(self.__url)
        self.__html = response.content
        self.__soup = BeautifulSoup(self.__html, "html.parser")

    def get_humidity(self):
        return float(self.__soup.find('span', {'class': 'humidity'}).text.replace('%', ''))
