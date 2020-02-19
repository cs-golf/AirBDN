import aqi

def get_aqi(val, pollutant):
    if pollutant == "P1":
        return float(aqi.to_iaqi(aqi.POLLUTANT_PM10, val, algo=aqi.ALGO_EPA))
    if pollutant == "P2":
        return float(aqi.to_iaqi(aqi.POLLUTANT_PM25, val, algo=aqi.ALGO_EPA))