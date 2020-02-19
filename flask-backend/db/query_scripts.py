from math import isnan

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