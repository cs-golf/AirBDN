import React, { useEffect, useState } from "react";

// the looks
import "./Map.css";
import aqiScale from "./aqiScale.png";

// components
// import Blurb from './Blurb'
import Scrub from "./Scrub";

// Leaflet - map component
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";

import { getAqiPM10, getAqiPM25 } from "./aqi";
import { Link } from "react-router-dom";
import { heatmap, sensorIcons, display } from "../../config.json";

import { getInfo, getReadings, getMapData } from "../call_api";

// Tiles the <div> with id='mapid', sets zoom & coordinates
const initializeMap = () => {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  window.abdnMap = L.map("mapid").setView([57.148, -2.11], 13);
  L.tileLayer(mapStyle, {
    maxZoom: 18,
    minZoom: 11
  }).addTo(window.abdnMap);
  window.abdnMap.zoomControl.setPosition("topright");
};

export default ({ mapDisplayValue, setSensorId }) => {
  // scrub = time machine timeline thing at the bottom of map
  const [scrubValue, setScrubValue] = useState(10000);

  const createTooltipText = sensor => {
    let tooltip;
    tooltip = `<div class="mapTooltip">`;
    tooltip += sensor.display_name
      ? `<p class="tooltipTitle">${sensor.display_name}</p>`
      : `<p class="tooltipTitle">Unknown Location</p>
         <p class="tooltipTitle">Sensor ID: ${sensor._id}</p>`;
    tooltip += `<ul class="tooltipValueList">`;
    for (let key in sensor.recent_values) {
      if (Object.keys(display.tooltips).includes(key)) {
        tooltip += `<li class="tooltipValue">${display.tooltips[key]}: ${sensor.recent_values[key]}</li>`;
      }
    }
    tooltip += `</ul>`;
    tooltip += `</div>`;
    return tooltip;
  };

  const createSensorIcon = sensor => {
    let tooltip = createTooltipText(sensor);
    return L.circle([sensor["lat"], sensor["lon"]], sensorIcons.config)
      .bindTooltip(tooltip, { className: "baseTooltip", direction: "top" })
      .on("click", e => {
        window.location.href = "/charts";
        setSensorId(sensor._id);
      });
  };

  const updateSensorLayer = async () => {
    if (!window.sensorLayer) window.sensorLayer = L.layerGroup();
    if (!window.abdnMap.hasLayer(window.sensorLayer))
      window.sensorLayer.addTo(window.abdnMap);
    getMapData(scrubValue).then(d => {
      window.sensorLayer.clearLayers();
      d.map(sensor => createSensorIcon(sensor)).map(icon =>
        window.sensorLayer.addLayer(icon)
      );
    });
  };

  const updateBlurb = displayValue => {
    L.imageOverlay(aqiScale, [
      [57.206, -2.184],
      [57.306, -2.284]
    ]).addTo(window.abdnMap);
    // let blurbDiv = document.getElementsByClassName('blurb')
    // console.log(blurbDiv)

    // L.marker([57.206, -2.184], { icon: blurb }).addTo(window.abdnMap)
  };

  const updateHeatmapLayer = async displayValue => {
    window.heatmapLayer
      ? window.heatmapLayer.addTo(window.abdnMap)
      : (window.heatmapLayer = new HeatmapOverlay(heatmap.config).addTo(
          window.abdnMap
        ));

    window.heatmapLayer.setData({ data: [] });

    const parseMapData = (data, displayValue) =>
      displayValue === "aqi"
        ? {
            data: data
              .filter(
                sensor =>
                  sensor["recent_values"]["pm10"] ||
                  sensor["recent_values"]["pm25"]
              )
              .map(sensor => ({
                lat: sensor["lat"],
                lng: sensor["lon"],
                value:
                  Math.max(
                    getAqiPM25(sensor.recent_values["pm10"]),
                    getAqiPM10(sensor.recent_values["pm25"])
                  ) / heatmap.redValues.aqi
              }))
          }
        : {
            data: data
              .filter(sensor => sensor["recent_values"][displayValue])
              .map(sensor => ({
                lat: sensor["lat"],
                lng: sensor["lon"],
                value:
                  sensor.recent_values[displayValue] /
                  heatmap.redValues[displayValue]
              }))
          };

    getMapData(scrubValue).then(d =>
      window.heatmapLayer.setData(parseMapData(d, displayValue))
    );
  };

  const setMapOverlay = displayValue => {
    if (displayValue === "sensors") {
      if (window.heatmapLayer) window.heatmapLayer.removeFrom(window.abdnMap);
      updateSensorLayer();
    } else {
      if (window.sensorLayer) window.sensorLayer.removeFrom(window.abdnMap);
      updateHeatmapLayer(displayValue);
    }
    // updateBlurb(displayValue)
  };

  // runs after component did mount
  // map has to be initialized (div with id='mapid' has to be 'tiled') after the page loads - hence useEffect()
  useEffect(() => {
    window.latestData = getInfo();
    window.weekOfData = getReadings();
    window.latestData.then(console.log);
    initializeMap();
    setMapOverlay(mapDisplayValue);
  }, []);

  // runs whenever mapDisplayValue changes
  // refreshes values from API and changes Overlay displayed on map
  useEffect(() => setMapOverlay(mapDisplayValue), [
    mapDisplayValue,
    scrubValue
  ]);

  return (
    <div className="map">
      <div id="mapid" />
      {mapDisplayValue === "aqi" && (
        <div className="imgContainer">
          <img
            className="topImage"
            src={aqiScale}
            alt="aqi_chart"
            height="870"
            width="1000"
          />
        </div>
      )}
      {/* <Blurb /> */}
      <Scrub scrubValue={scrubValue} setScrubValue={setScrubValue} />
    </div>
  );
};
