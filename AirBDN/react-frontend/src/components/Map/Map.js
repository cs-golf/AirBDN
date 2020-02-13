import React, { useEffect } from "react";
import axios from "axios";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";
import { heatmap, sensorIcons } from "../../config.json";
import "./Map.css";

export default function Map({ targetValue, setPage }) {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  // const mapStyle = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
  // const mapStyle = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

  const parseMapData = (data, targetValue) => ({
    data: data
      .filter(sensor => sensor["recent_values"][targetValue])
      .map(sensor => ({
        lat: sensor["lat"],
        lng: sensor["lon"],
        value:
          sensor.recent_values[targetValue] / heatmap.redValues[targetValue]
      }))
  });

  let createSensorIcon = coord => {
    return L.circle(coord, sensorIcons.config)
      .bindTooltip("<p>testing</p>", { direction: "top" })
      .on("click", e => {
        console.log(e.target);
        setPage("SensorPage");
      });
  };

  const getMapCoords = data =>
    data.map(sensor => [sensor["lat"], sensor["lon"]]);

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
    });

    axios.get(`/api/info`).then(resp => {
      window.sensorIconLayer = L.layerGroup(
        getMapCoords(resp.data).map(coord => createSensorIcon(coord))
      );
    });
  }, []);

  // runs whenever targetValue changes
  // changes and refreshes values displayed on map (eg.: humidity => temperature)
  useEffect(() => {
    axios.get(`/api/info`).then(resp => {
      if (targetValue === "sensors") {
        window.heatmapLayer.removeFrom(window.abdn_map);
        window.sensorIconLayer.addTo(window.abdn_map);
      } else {
        window.heatmapLayer.setData(parseMapData(resp.data, targetValue));
        window.sensorIconLayer.removeFrom(window.abdn_map);
        window.heatmapLayer.addTo(window.abdn_map);
      }
    });
  }, [targetValue]);

  return <div id="mapid" />;
}
