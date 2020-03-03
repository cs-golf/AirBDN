from math import isnan
from datetime import datetime


def floatify(value):
    # converts "{number}" to float
    # but not if "{number}" is nan
    # omits "{string}"
    try:
        floatified = float(value)
        if isnan(floatified):
            return value
        else:
            return floatified
    except:
        return value


def floor_date(date, period_in_s=300):
    ts = datetime.timestamp(date)
    new_ts = ts - (ts % 300)
    return(datetime.fromtimestamp(new_ts))
