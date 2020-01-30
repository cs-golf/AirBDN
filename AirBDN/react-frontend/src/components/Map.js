import React, { useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Box from "@material-ui/core/Box";
import tinygradient from "tinygradient";
// import { shadows } from "@material-ui/system";

export default function Map({ darkMode }) {
  // const mapStyle = darkMode ? 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png' : "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

  // runs after component did mount
  useEffect(() => {
    const gradientGreenRed = tinygradient("#00c40d", "#d9e32d", "#de3131");
    var abdn_map = L.map("mapid").setView([57.148, -2.11], 13);

    L.tileLayer(mapStyle, {
      maxZoom: 18,
      minZoom: 11,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(abdn_map);

    const addMarkers = (data, targetValue) => {
      for (let sensor in data) {
        if (data[sensor].recent_values[targetValue]) {
          L.circleMarker([data[sensor].lat, data[sensor].lon], {
            color: "#00000000",
            fillColor: `#${gradientGreenRed
              .rgbAt(Math.min(1, data[sensor].recent_values[targetValue] / 35))
              .toHex()}A0`,
            fillOpacity: 1,
            radius: 15
          }).addTo(abdn_map);
        }
      }
    };

    axios.get(`/api/info`).then(resp => {
      addMarkers(resp.data, "P1");
    });
  }, []);

  return (
    <Box boxShadow={4}>
      <div
        id="mapid"
        style={{ height: "calc(100vh - 50px)", marginTop: "50px" }}
      ></div>
    </Box>
  );
}
