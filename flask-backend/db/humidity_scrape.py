from bs4 import BeautifulSoup
import requests


page = requests.get('https://www.metoffice.gov.uk/weather/forecast/gfnt07u1s#?date=2020-02-13')

soup = BeautifulSoup(page.content, "html.parser")

humidity = int(soup.find('span', {'class': 'humidity'}).text.replace('%',''))

print(humidity)

