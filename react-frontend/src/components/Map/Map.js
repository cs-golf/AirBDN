<<<<<<< HEAD
<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap'
import { heatmap, sensorIcons, display } from '../../config.json'
import './Map.css'
import aqiScale from './aqiScale.png'
import Scrub from './Scrub'

import { getAqiPM10, getAqiPM25 } from './aqi'

const getInfo = async () => {
	setTimeout(() => (window.latestData = getInfo()), 150000)
	let resp = await axios.get(`https://airbdn-api.herokuapp.com/api/info`)
	return resp.data
}

const getReadings = async (grouped = true) => {
	// helper functions
	let getRelativeDate = (dd = 0, date = new Date()) => new Date(date.setDate(date.getDate() + dd))
	let parseDate = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

	let resp = await axios.get(
		`https://airbdn-api.herokuapp.com/api/readings/sensor=any/start=${parseDate(
			getRelativeDate(-7)
		)}/end=any`
	)

	let groupByDate = readings => {
		let out = readings.reduce((rv, x) => {
			;(rv[x['timestamp']['$date']] = rv[x['timestamp']['$date']] || []).push(x)
			return rv
		}, {})
		return Object.values(out)
	}

	return grouped ? groupByDate(resp.data) : resp.data
}

let getMapData = async scrubValue => {
	let data = await window.latestData
	if (scrubValue == 10000) return data

	let weekOfData = await window.weekOfData
	let n = Math.floor((scrubValue * weekOfData.length) / 10000)
	return data.map(sensor => {
		let copy = sensor
		let match = weekOfData[n].filter(a => a.location_id === sensor._id)
		if (match[0]) {
			for (let key in match[0]) {
				if (key !== '_id' && key !== 'location_id' && key !== 'timestamp')
					copy.recent_values[key] = match[0][key]
			}
		}
		return copy
	})
}

// Tiles the <div> with id='mapid', sets zoom & coordinates
const initializeMap = () => {
	const mapStyle = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
	window.abdnMap = L.map('mapid').setView([57.148, -2.11], 13)
	L.tileLayer(mapStyle, {
		maxZoom: 18,
		minZoom: 11
	}).addTo(window.abdnMap)
	window.abdnMap.zoomControl.setPosition('topright')
}

export default ({ mapDisplayValue, setPage, setSensorId }) => {
	const [scrubValue, setScrubValue] = useState(10000)

	const createTooltipText = sensor => {
		let tooltip
		sensor.display_name
			? (tooltip = `
			<div class="tooltipTitle">${sensor.display_name}</div>
		`)
			: (tooltip = `
			<p class="tooltipTitle">Sensor ID: ${sensor._id}</p>
		`)
		tooltip += `<ul class="tooltipValueList">`
		for (let key in sensor.recent_values) {
			if (key !== 'pressure_at_sealevel') {
				tooltip += `<li class="tooltipValue">${display.tooltips[key]}: ${sensor.recent_values[key]}</li>`
			}
		}
		tooltip += `</ul>`
		return tooltip
	}

	const createSensorIcon = sensor => {
		let tooltip = createTooltipText(sensor)
		return L.circle([sensor['lat'], sensor['lon']], sensorIcons.config)
			.bindTooltip(tooltip, { className: 'mapTooltip', direction: 'top' })
			.on('click', e => {
				setPage('sensorPage')
				setSensorId(sensor._id)
			})
	}

	const updateSensorLayer = async () => {
		if (!window.sensorLayer) window.sensorLayer = L.layerGroup()
		if (!window.abdnMap.hasLayer(window.sensorLayer)) window.sensorLayer.addTo(window.abdnMap)
		getMapData(scrubValue).then(d => {
			window.sensorLayer.clearLayers()
			d.map(sensor => createSensorIcon(sensor)).map(icon => window.sensorLayer.addLayer(icon))
		})
	}

	const updateHeatmapLayer = async displayValue => {
		window.heatmapLayer
			? window.heatmapLayer.addTo(window.abdnMap)
			: (window.heatmapLayer = new HeatmapOverlay(heatmap.config).addTo(window.abdnMap))

		window.heatmapLayer.setData({ data: [] })

		const parseMapData = (data, displayValue) =>
			displayValue === 'aqi'
				? {
						data: data
							.filter(
								sensor =>
									sensor['recent_values']['pm10'] ||
									sensor['recent_values']['pm25']
							)
							.map(sensor => ({
								lat: sensor['lat'],
								lng: sensor['lon'],
								value:
									Math.max(
										getAqiPM25(sensor.recent_values['pm10']),
										getAqiPM10(sensor.recent_values['pm25'])
									) / heatmap.redValues.aqi
							}))
				  }
				: {
						data: data
							.filter(sensor => sensor['recent_values'][displayValue])
							.map(sensor => ({
								lat: sensor['lat'],
								lng: sensor['lon'],
								value:
									sensor.recent_values[displayValue] /
									heatmap.redValues[displayValue]
							}))
				  }

		getMapData(scrubValue).then(d => window.heatmapLayer.setData(parseMapData(d, displayValue)))
	}

	const setMapOverlay = displayValue => {
		if (displayValue === 'sensors') {
			if (window.heatmapLayer) window.heatmapLayer.removeFrom(window.abdnMap)
			updateSensorLayer()
		} else {
			if (window.sensorLayer) window.sensorLayer.removeFrom(window.abdnMap)
			updateHeatmapLayer(displayValue)
		}
	}

	// runs after component did mount
	// map has to be initialized (div with id='mapid' has to be 'tiled') after the page loads - hence useEffect()
	useEffect(() => {
		window.latestData = getInfo()
		window.weekOfData = getReadings()
		initializeMap()
		setMapOverlay(mapDisplayValue)
	}, [])

	// runs whenever mapDisplayValue changes
	// refreshes values from API and changes Overlay displayed on map
	useEffect(() => setMapOverlay(mapDisplayValue), [mapDisplayValue, scrubValue])

	return (
		<div className='map'>
			<div id='mapid' />
			{mapDisplayValue === 'aqi' && (
				<div className='imgContainer'>
					<img
						className='topImage'
						src={aqiScale}
						alt='aqi_chart'
						height='870'
						width='1000'
					/>
				</div>
			)}
			<Scrub scrubValue={scrubValue} setScrubValue={setScrubValue} />
		</div>
	)
}
=======
import React, { useEffect, useState } from "react";

// the looks
import "./Map.css";

// components
import Blurb from "./Blurb";
import Scrub from "./Scrub";

// Leaflet - map component
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";

import { calculateAqi } from "./aqi";
import { heatmap, sensorIcons, display } from "../../config.json";

import { useHistory } from "react-router-dom";

// Tiles the <div> with id='mapid', sets zoom & coordinates
const initializeMap = () => {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  window.abdnMap = L.map("mapid").setView([57.148, -2.095], 13);
  L.tileLayer(mapStyle, {
    maxZoom: 18,
    minZoom: 11,
  }).addTo(window.abdnMap);
  window.abdnMap.zoomControl.setPosition("topright");

  window.sensorLayer = L.layerGroup().addTo(window.abdnMap);

  window.heatmapLayer = new HeatmapOverlay(heatmap.config).addTo(
    window.abdnMap
  );
};

export default (props) => {
  let {
    displayedStat,
    setSensorId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = props;
  // scrub = time machine timeline thing at the bottom of map
  const [scrubValue, setScrubValue] = useState(10000);
  const history = useHistory();

  const getMapData = async (scrubValue) => {
    let data = await window.latestData;
    if (+scrubValue === 10000) return data;

    let groupedData = await window.groupedData;
    let n = Math.floor((scrubValue * groupedData.length) / 10000);
    return data.map((sensor) => {
      let copy = sensor;
      let match = groupedData[n].filter((a) => a.location_id === sensor._id);
      if (match[0]) {
        for (let key in match[0]) {
          if (key !== "_id" && key !== "location_id" && key !== "timestamp")
            copy.recent_values[key] = match[0][key];
        }
      }
      return copy;
    });
  };

  const createTooltipText = (sensor) => {
    let tooltip;
    tooltip = `<div class="tooltip">`;
    tooltip += sensor.display_name + `<br>`;
    tooltip += `${
      displayedStat === "pressure"
        ? Math.floor(sensor.recent_values[displayedStat] / 100)
        : sensor.recent_values[displayedStat]
    } ${display.units[displayedStat]}`;
    tooltip += `</div>`;
    return tooltip;
  };

  const createSensorIcon = (sensor) => {
    let icon = L.circle([sensor["lat"], sensor["lon"]], sensorIcons.default);
    if (sensor.recent_values[displayedStat])
      icon
        .bindTooltip(createTooltipText(sensor), {
          className: "baseTooltip",
          direction: "top",
        })
        .on("click", (e) => {
          setSensorId(sensor._id);
          history.push("/charts");
        })
        .on("mouseover", (e) => {
          e.target.setStyle(sensorIcons.hover);
        })
        .on("mouseout", (e) => {
          e.target.setStyle(sensorIcons.default);
        });
    return icon;
  };

  const updateSensorLayer = async () => {
    getMapData(scrubValue).then((d) => {
      window.sensorLayer.clearLayers();
      d.map((sensor) => window.sensorLayer.addLayer(createSensorIcon(sensor)));
    });
  };

  const parseMapData = (data, displayedStat) => ({
    data: data
      .filter((sensor) => sensor.recent_values[displayedStat])
      .map((sensor) => {
        console.log(sensor.recent_values[displayedStat]);
        return {
          lat: sensor.lat,
          lng: sensor.lon,
          value:
            (displayedStat === "pm10" || displayedStat === "pm25"
              ? calculateAqi(displayedStat)(sensor.recent_values[displayedStat])
              : displayedStat === "pressure"
              ? sensor.recent_values[displayedStat] - 98000
              : sensor.recent_values[displayedStat]) /
            heatmap.redValues[displayedStat],
        };
      }),
  });

  const updateHeatmapLayer = async (displayedStat) => {
    getMapData(scrubValue).then((d) =>
      window.heatmapLayer.setData(parseMapData(d, displayedStat))
    );
  };

  const setMapOverlay = (displayedStat) => {
    updateSensorLayer();
    updateHeatmapLayer(displayedStat);
  };

  // runs after component did mount
  // map has to be initialized (div with id='mapid' has to be 'tiled') after the page loads - hence useEffect()
  useEffect(initializeMap, []);

  // runs whenever displayedStat or scrubValue changes
  // refreshes values from API and changes Overlay displayed on map
  useEffect(() => setMapOverlay(displayedStat), [displayedStat, scrubValue]);

  return (
    <div className="map">
      <div id="mapid" />
      <Blurb displayedStat={displayedStat} />
      <Scrub
        scrubValue={scrubValue}
        setScrubValue={setScrubValue}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};
>>>>>>> Stashed changes
=======
import React, { useEffect, useState } from "react";

// the looks
import "./Map.css";
import aqi_scale from "./aqi_scale.png";
import blurb from "./blurb.png";

// components
import Blurb from "./Blurb";
import Scrub from "./Scrub";

// Leaflet - map component
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";

import { calculateAqi } from "./aqi";
import { heatmap, sensorIcons, display } from "../../config.json";

import { useHistory } from "react-router-dom";

import { useWindowSize } from "../hooks";

// Tiles the <div> with id='mapid', sets zoom & coordinates
const initializeMap = () => {
  const mapStyle = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  window.abdnMap = L.map("mapid").setView([57.148, -2.095], 13);
  L.tileLayer(mapStyle, {
    maxZoom: 18,
    minZoom: 11
  }).addTo(window.abdnMap);
  window.abdnMap.zoomControl.setPosition("topright");

  window.sensorLayer = L.layerGroup().addTo(window.abdnMap);

  window.heatmapLayer = new HeatmapOverlay(heatmap.config).addTo(
    window.abdnMap
  );
};

export default ({
  displayedStat,
  setSensorId,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  // scrub = time machine timeline thing at the bottom of map
  const [scrubValue, setScrubValue] = useState(10000);
  const history = useHistory();
  const [w, h] = useWindowSize();

  const getMapData = async scrubValue => {
    let data = await window.latestData;
    if (+scrubValue === 10000) return data;

    let groupedData = await window.groupedData;
    let n = Math.floor((scrubValue * groupedData.length) / 10000);
    return data.map(sensor => {
      let copy = sensor;
      let match = groupedData[n].filter(a => a.location_id === sensor._id);
      if (match[0]) {
        for (let key in match[0]) {
          if (key !== "_id" && key !== "location_id" && key !== "timestamp")
            copy.recent_values[key] = match[0][key];
        }
      }
      return copy;
    });
  };

  const createTooltipText = sensor => {
    let tooltip;
    tooltip = `<div class="tooltip">`;
    tooltip += sensor.display_name + `<br>`;
    tooltip += `${
      displayedStat === "pressure"
        ? Math.floor(sensor.recent_values[displayedStat] / 100)
        : sensor.recent_values[displayedStat]
    } ${display.units[displayedStat]}`;
    tooltip += `</div>`;
    return tooltip;
  };

  const createSensorIcon = sensor => {
    let icon = L.circle([sensor["lat"], sensor["lon"]], sensorIcons.default);
    if (sensor.recent_values[displayedStat])
      icon
        .bindTooltip(createTooltipText(sensor), {
          className: "baseTooltip",
          direction: "top"
        })
        .on("click", e => {
          setSensorId(sensor._id);
          history.push("/charts");
        })
        .on("mouseover", e => {
          e.target.setStyle(sensorIcons.hover);
        })
        .on("mouseout", e => {
          e.target.setStyle(sensorIcons.default);
        });
    return icon;
  };

  const updateSensorLayer = async () => {
    getMapData(scrubValue).then(d => {
      window.sensorLayer.clearLayers();
      d.map(sensor => window.sensorLayer.addLayer(createSensorIcon(sensor)));
    });
  };

  const showBlurb = () => {
    L.imageOverlay(blurb, [
      [57.15, -2.003],
      [57.18, -2.073]
    ]).addTo(window.abdnMap);
  };

  const parseMapData = (data, displayedStat) => ({
    data: data
      .filter(sensor => sensor.recent_values[displayedStat])
      .map(sensor => ({
        lat: sensor.lat,
        lng: sensor.lon,
        value:
          (displayedStat === "pm10" || displayedStat === "pm25"
            ? calculateAqi(displayedStat)(sensor.recent_values[displayedStat])
            : sensor.recent_values[displayedStat]) /
          heatmap.redValues[displayedStat]
      }))
  });

  const updateHeatmapLayer = async displayedStat => {
    getMapData(scrubValue).then(d =>
      window.heatmapLayer.setData(parseMapData(d, displayedStat))
    );
  };

  const setMapOverlay = displayedStat => {
    updateSensorLayer();
    updateHeatmapLayer(displayedStat);
  };

  // runs after component did mount
  // map has to be initialized (div with id='mapid' has to be 'tiled') after the page loads - hence useEffect()
  useEffect(initializeMap, []);

  // runs whenever displayedStat or scrubValue changes
  // refreshes values from API and changes Overlay displayed on map
  useEffect(() => setMapOverlay(displayedStat), [displayedStat, scrubValue]);
  useEffect(() => {
    if (w > h) showBlurb();
  }, [w, h]);

  return (
    <div className="map">
      <div id="mapid" />
      {(displayedStat === "pm10" || displayedStat === "pm25") && (
        <div className="imgContainer">
          <img
            className="topImage"
            src={aqi_scale}
            alt="aqi_chart"
            height="870"
            width="1000"
          />
        </div>
      )}
      {h > w && <Blurb />}
      <Scrub
        scrubValue={scrubValue}
        setScrubValue={setScrubValue}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};
>>>>>>> 04b0315337a027f09e7f9662a53591c3eab37053
