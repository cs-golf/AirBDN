import unittest
from db.luftdaten_get_api import get_raw_info
from db.luftdaten_get_archive import get_raw_readings
from db.query_scripts import floatify, floor_date
from datetime import datetime

luftdaten_area_box = "57.23,-2.36,57.07,-2.04"


class TestGetLuftdatenApi(unittest.TestCase):

    def test_get_raw_info(self):
        result = get_raw_info("57.23,-2.36,57.07,-2.04")
        self.assertTrue(len(result) > 0)


class TestGetLuftdatenArchive(unittest.TestCase):

    def test_get_raw_readings(self):
        result = get_raw_readings("dht22_sensor_22550", "2019-12-23")
        self.assertTrue(len(result) > 0)


class TestQueryScripts(unittest.TestCase):

    def test_floatify(self):
        self.assertTrue(floatify("test") == 'test')
        self.assertTrue(floatify("nan") == 'nan')
        self.assertTrue(floatify("420") == 420)

    def test_floor_date(self):
        result = floor_date(datetime(2020, 5, 17, 10, 10, 3))
        self.assertTrue(result == datetime(2020, 5, 17, 10, 10, 0))


if __name__ == "__main__":
    unittest.main()
