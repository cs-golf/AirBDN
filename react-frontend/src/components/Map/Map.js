import React, { useEffect, useState } from 'react'
import axios from 'axios'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap'
import { heatmap, sensorIcons, display } from '../../config.json'
import './Map.css'
import aqiScale from './aqiScale.png'
import Scrub from './Scrub'
// import Blurb from './Blurb'

import { getAqiPM10, getAqiPM25 } from './aqi'

const getInfo = async () => {
	setTimeout(() => (window.latestData = getInfo()), 150000)
	let resp = await axios.get(`https://airbdn-api.herokuapp.com/info`)
	return resp.data
}

const getReadings = async (grouped = true) => {
	// helper functions
	let getRelativeDate = (dd = 0, date = new Date()) => new Date(date.setDate(date.getDate() + dd))
	let parseDate = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

	let resp = await axios.get('https://airbdn-api.herokuapp.com/readings', {
		params: { after: parseDate(getRelativeDate(-7)) }
	})

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
			if (Object.keys(display.tooltips).includes(key)) {
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

	const updateBlurb = displayValue => {
		L.imageOverlay(aqiScale, [
			[57.206, -2.184],
			[57.306, -2.284]
		]).addTo(window.abdnMap)
		// let blurbDiv = document.getElementsByClassName('blurb')
		// console.log(blurbDiv)

		// L.marker([57.206, -2.184], { icon: blurb }).addTo(window.abdnMap)
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
		// updateBlurb(displayValue)
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
			{/* <Blurb /> */}
			<Scrub scrubValue={scrubValue} setScrubValue={setScrubValue} />
		</div>
	)
}
