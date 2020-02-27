import scrapy


class KalinSpider(scrapy.Spider):
    name = 'kalin'
    allowed_domains = [
        'https://www.timeanddate.com/weather/uk/aberdeen/historic?month=5&year=2016']
    start_urls = [
        'http://www.timeanddate.com/weather/uk/aberdeen/historic?month=5&year=2016']

    def parse(self, response):
        dic = {}
        for i in range(1, 44):
            dic['time'] = response.xpath(
                '//*[@id="wt-his"]/tbody/tr[' + str(i) + ']/th/text()').extract()
            dic['humidity'] = response.xpath(
                '//*[@id="wt-his"]/tbody/tr[' + str(i) + ']/td[6]/text()').extract()
            print(dic)
            yield dic
     
