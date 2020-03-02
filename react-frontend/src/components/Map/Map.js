import React, { useEffect } from 'react'
import axios from 'axios'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap'
import { heatmap, sensorIcons } from '../../config.json'
import './Map.css'

const mapStyle = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
// const mapStyle = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
// const mapStyle = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

const initializeMap = () => {
	window.abdnMap = L.map('mapid').setView([57.148, -2.11], 13)
	L.tileLayer(mapStyle, {
		maxZoom: 18,
		minZoom: 11
	}).addTo(window.abdnMap)
	window.abdnMap.zoomControl.setPosition('topright')
}

const getInfo = async () => await axios.get(`https://airbdn-api.herokuapp.com/api/info`)

const ApiMap = ({ mapDisplayValue, setPage, setSensorId }) => {
	const createSensorIcon = sensor => {
		let tooltipText = `<h3>${sensor._id}</h3><p>${sensor.recent_values[mapDisplayValue]}</p>`
		return L.circle([sensor['lat'], sensor['lon']], sensorIcons.config)
			.bindTooltip(tooltipText, { direction: 'top' })
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

			let response = await getInfo()

			response.data
				.map(sensor => createSensorIcon(sensor))
				.map(icon => window.sensorLayer.addLayer(icon))
		}
	}

	const updateheatmapLayer = async displayValue => {
		window.heatmapLayer
			? window.heatmapLayer.addTo(window.abdnMap)
			: (window.heatmapLayer = new HeatmapOverlay(heatmap.config))

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

		let response = await getInfo()

		window.heatmapLayer.setData(parseMapData(response.data, displayValue))
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

export default ApiMap
