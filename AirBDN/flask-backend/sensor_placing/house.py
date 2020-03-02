import overpy_api

class House:
    def __init__(self, _id, lat, lon):
        self._id = _id
        self.lat = lat
        self.lon = lon
        self.covered = False
        self.coverage = 0


def house_constructor():

    result = overpy_api.bbox_query("57.101011530769,-2.1986389160156,57.206594429377,-2.028694152832")
    house_list = list()

    for node in result.nodes:
        house_list.append(House(node.id, node.lat, node.lon))
    for way in result.ways:
        total_lat = 0
        total_lon = 0
        for node in way.nodes:
            if node.lat:
                total_lat += node.lat
            if node.lon:
                total_lon += node.lon
        average_lat = total_lat/len(way.nodes)
        average_lon = total_lon/len(way.nodes)

        house_list.append(House(way.id, average_lat, average_lon))

    return house_list

