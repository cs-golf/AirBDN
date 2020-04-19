import unittest
from application import index, get_info, stream_readings, get_readings


class TestIndexRoute(unittest.TestCase):
    def test_index(self):
        result = index()
        self.assertTrue(type(result) == type(""))


class TestGetInfo(unittest.TestCase):
    def test_get_info(self):
        result = get_info()
        self.assertTrue(len(result.data) > 0)


if __name__ == "__main__":
    unittest.main()
