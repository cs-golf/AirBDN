import React, { useEffect } from "react";
import axios from "axios";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";
import { heatmap } from "../../config.json";
import "./Map.css";

export default function Map({ targetValue }) {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";

  const parseMapData = (data, targetValue) => ({
    data: data
      .filter(sensor => sensor["recent_values"][targetValue])
      .map(sensor => ({
        lat: sensor["lat"],
        lng: sensor["lon"],
        value: sensor.recent_values[targetValue] / heatmap.redValues[targetValue]
      }))
  });

  // runs after component did mount
  // tiles the map div
  useEffect(() => {
    window.abdn_map = L.map("mapid").setView([57.148, -2.11], 13);

    L.tileLayer(mapStyle, {
      maxZoom: 18,
      minZoom: 11,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(window.abdn_map);

    window.heatmapLayer = new HeatmapOverlay({
      ...heatmap.config,
      valueField: "value"
    }).addTo(window.abdn_map);
  }, []);

  // runs whenever targetValue changes
  // changes and refreshes values displayed on map (eg.: humidity => temperature)
  useEffect(() => {
    axios.get(`/api/info`).then(resp => {
      window.heatmapLayer.setData(parseMapData(resp.data, targetValue));
    });
  }, [targetValue]);

  return <div id="mapid" />;
}
