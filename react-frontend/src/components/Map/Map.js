import React, { useEffect } from 'react'
import axios from 'axios'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap'
import { heatmap, sensorIcons, display } from '../../config.json'
import './Map.css'

const getInfo = async () => {
	let response = await axios.get(`https://airbdn-api.herokuapp.com/api/info`)
	return response.data
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
	const createTooltipText = sensor => {
		let tooltip = `
			<p class="tooltipTitle">Sensor ID: ${sensor._id}</p>
			<p class="tooltipTitle">( ${sensor.lat}, ${sensor.lon} )</p>
		`
		tooltip += `<ul class="tooltipValueList">`
		for (let key in sensor.recent_values) {
			if (key !== 'pressure_at_sealevel') {
				tooltip += `<li class="tooltipValue">${display.values[key]}: ${sensor.recent_values[key]}</li>`
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
		if (window.sensorLayer) {
			window.sensorLayer.addTo(window.abdnMap)
		} else {
			window.sensorLayer = L.layerGroup().addTo(window.abdnMap)

			let infoData = await getInfo()

			infoData
				.map(sensor => createSensorIcon(sensor))
				.map(icon => window.sensorLayer.addLayer(icon))
		}
	}

	const updateheatmapLayer = async displayValue => {
		window.heatmapLayer
			? window.heatmapLayer.addTo(window.abdnMap)
			: (window.heatmapLayer = new HeatmapOverlay(heatmap.config).addTo(window.abdnMap))

		window.heatmapLayer.setData({ data: [] })

		const parseMapData = (data, displayValue) => ({
			data: data
				.filter(sensor => sensor['recent_values'][displayValue])
				.map(sensor => ({
					lat: sensor['lat'],
					lng: sensor['lon'],
					value: sensor.recent_values[displayValue] / heatmap.redValues[displayValue]
				}))
		})

		let infoData = await getInfo()

		window.heatmapLayer.setData(parseMapData(infoData, displayValue))
	}

	const setMapOverlay = displayValue => {
		if (displayValue === 'sensors') {
			if (window.heatmapLayer) window.heatmapLayer.removeFrom(window.abdnMap)
			updateSensorLayer()
		} else {
			if (window.sensorLayer) window.sensorLayer.removeFrom(window.abdnMap)
			updateheatmapLayer(displayValue)
		}
	}

	// runs after component did mount
	// map has to be initialized (div with id='mapid' has to be 'tiled') after the page loads - hence useEffect()
	useEffect(() => {
		initializeMap()
		setMapOverlay(mapDisplayValue)
	}, [])

	// runs whenever mapDisplayValue changes
	// refreshes values from API and changes Overlay displayed on map
	useEffect(() => setMapOverlay(mapDisplayValue), [mapDisplayValue])

	return <div id='mapid' />
}
