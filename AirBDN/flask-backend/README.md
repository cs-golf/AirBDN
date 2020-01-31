Collection "info" holds general sensor information; id, latitude, longitude; and most recent readings from the sensor

[
  {
    "_id": 11991,
    "lat": 57.15,
    "lon": -2.134,
    "sensors": { "DHT22": 23629, "SDS011": 23628 },
    "recent_values": {
      "temperature": 6.4,
      "humidity": 99.9,
      "P1": 1.5,
      "P2": 0.6
    }
  },
  {
    "_id": 3121,
    "lat": 57.138,
    "lon": -2.078,
    "sensors": { "SDS011": 5331 },
    "recent_values": { "P1": 3.97, "P2": 1.93 }
  }
]



Collection "readings" holds an object, containing all sensor readings, for each timestamp X location_id

[
  {
    "_id": { "$oid": "5e320e33b391fea367418a14" },
    "location_id": 11441,
    "timestamp": { "$date": 1575165745000 },
    "P1": 0.93,
    "P2": 0.6
  },
  {
    "_id": { "$oid": "5e320e33b391fea367418a24" },
    "location_id": 11441,
    "timestamp": { "$date": 1575166347000 },
    "P1": 1.23,
    "P2": 0.4,
    "temperature": 0.5,
    "humidity": 99.9
  }
]
