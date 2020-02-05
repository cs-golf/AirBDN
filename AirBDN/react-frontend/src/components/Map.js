import React, { useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Box from "@material-ui/core/Box";
// import "leaflet.heat/dist/leaflet-heat.js";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";
import { heatmapRedValues, heatmapConfig } from "../config.json";

export default function Map({ darkMode }) {
  // const mapStyle = darkMode ? 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png' : "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

  // runs after component did mount
  useEffect(() => {
    var abdn_map = L.map("mapid").setView([57.148, -2.11], 13);

    L.tileLayer(mapStyle, {
      maxZoom: 18,
      minZoom: 11,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(abdn_map);

    const parseMapData = (data, targetValue) => {
      console.log(heatmapRedValues[targetValue]);
      return {
        data: data
          .filter(sensor => sensor["recent_values"][targetValue])
          .map(sensor => {
            return {
              lat: sensor["lat"],
              lng: sensor["lon"],
              value:
                sensor["recent_values"][targetValue] /
                heatmapRedValues[targetValue]
            };
          })
      };
    };

    axios.get(`/api/info`).then(resp => {
      let heatmapLayer = new HeatmapOverlay({
        ...heatmapConfig,
        valueField: "value"
      });
      heatmapLayer.setData(parseMapData(resp.data, "P1"));
      heatmapLayer.addTo(abdn_map);
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
