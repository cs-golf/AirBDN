from geopy.distance import geodesic, great_circle
from house import house_constructor
from sensor import sensor_constructor

def get_distance(sensor_coordinates, house_coordiantes):

    return geodesic(sensor_coordinates, house_coordiantes).km

def get_uncovered_houses(sensor_list, house_list):

    uncovered_houses = list()
    for house in house_list:
        for sensor in sensor_list:
            if get_distance((sensor.lat, sensor.lon), (house.lat, house.lon)) <= 0.4:
                house.covered = True
                break
        if house.covered is False:
            uncovered_houses.append(house)

    return uncovered_houses


def get_next_sensor(uncovered_houses):

    potential_sensors = list()

    for next_sensor in uncovered_houses:
        for house in uncovered_houses:
            if get_distance((next_sensor.lat, next_sensor.lon), (house.lat, house.lon)) <= 0.4:
                next_sensor.coverage += 1
        potential_sensors.append([next_sensor, next_sensor.coverage])

    potential_sensors = sorted(potential_sensors, key=lambda x: x[1], reverse=True)
    next_sensor = potential_sensors[0][0]

    return next_sensor

if __name__ == "__main__":

    sensor_list = sensor_constructor()
    house_list = house_constructor()
    uncovered_houses = get_uncovered_houses(sensor_list, house_list)

    next_sensor = get_next_sensor(uncovered_houses)
    print(next_sensor._id, next_sensor.lat, next_sensor.lon)
