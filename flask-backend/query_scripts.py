from math import isnan
from datetime import datetime
from dateutil.parser import parse

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





def compare_times(time_a, time_b, time_dif=10):
    time_a = parse(time_a)
    time_b = parse(time_b)
    if time_a >= time_b:
        difference = time_a-time_b
    elif time_a < time_b:
        difference = time_b-time_a

    if difference.seconds < time_dif:
        return True


# ----test----
# t1 ="2020-03-30 22:00:00"
# t2 = "2020-03-30 22:00:06"
# compare_times( t2,t1)