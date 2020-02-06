import React, { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import Box from "@material-ui/core/Box";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";
import { heatmapRedValues, heatmapConfig } from "../../config.json";
import "./Map.css";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

export default function Map({ darkMode, targetValue }) {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  // const mapStyle = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
  // const mapStyle = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

  const parseMapData = (data, targetValue) => {
    return {
      data: data
        .filter(sensor => sensor["recent_values"][targetValue])
        .map(sensor => {
          return {
            lat: sensor["lat"],
            lng: sensor["lon"],
            value:
              sensor.recent_values[targetValue] / heatmapRedValues[targetValue]
          };
        })
    };
  };

  let abdn_map;
  let heatmapLayer = new HeatmapOverlay({
    ...heatmapConfig,
    valueField: "value"
  });
  // runs after component did mount
  useEffect(() => {
    abdn_map = L.map("mapid").setView([57.148, -2.11], 13);

    L.tileLayer(mapStyle, {
      maxZoom: 18,
      minZoom: 11,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(abdn_map);
    
    axios.get(`/api/info`).then(resp => {
      heatmapLayer.setData(parseMapData(resp.data, targetValue));
    });
    heatmapLayer.addTo(abdn_map);
  }, []);

  // changes values displayed on map (eg.: humidity => temperature)
  useEffect(() => {
    console.log(heatmapLayer);
  }, [targetValue]);

  return <div id="mapid" />;
}
