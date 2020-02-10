import aqi

def PM25_AQI(val):
    return aqi.to_iaqi(aqi.POLLUTANT_PM25, val, algo=aqi.ALGO_EPA)
    
def PM10_AQI(val):
    return aqi.to_iaqi(aqi.POLLUTANT_PM10, val, algo=aqi.ALGO_EPA)