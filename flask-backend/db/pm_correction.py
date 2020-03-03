def normalisePM25(pm25, humidity):
   return pm25/(1.0+0.48756*pow((humidity/100.0), 8.60068))


def normalisePM10(pm10, humidity):
   return pm10/(1.0+0.81559*pow((humidity/100.0), 5.83411))

