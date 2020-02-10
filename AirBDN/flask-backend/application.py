from flask import Flask, Response
from bson.json_util import dumps

from db.mongo import db_info, db_readings, db_query

application = Flask(__name__)


def get_info():
    output = dumps(db_query(db_info))
    return Response(output,  mimetype="application/json")


def get_readings():
    output = dumps(db_query(db_readings).limit(20))
    return Response(output,  mimetype='application/json')


application.add_url_rule('/api/info', 'info', get_info)
application.add_url_rule('/api/20readings', 'readings', get_readings)


if __name__ == "__main__":
    application.run(port=1111)
