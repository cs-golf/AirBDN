import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import './SensorChart.css'

export default function SensorChart({
	sensorId,
	startDate,
	endDate,
	displayValue,
	labelSparsity = 5
}) {
	const [data, setData] = useState()

	const getReadings = (sensor = 'any', start = 'any', end = 'any') =>
		axios
			.get(`/api/readings/sensor=${sensor}/start=${start}/end=${end}`)
			.then(resp => resp.data)

	const parseReadings = (readings, displayValue, oneInN) => ({
		labels: readings
			.filter(r => r[displayValue])
			.map(r => new Date(r.timestamp.$date).toISOString())
			.map((r, i) => (!(i % oneInN) ? r : '')),
		data: readings.filter(r => r[displayValue]).map(r => r[displayValue])
	})

	useEffect(() => {
		getReadings(sensorId, startDate, endDate).then(readings => {
			let parsedReadings = parseReadings(readings, displayValue, labelSparsity)
			setData({
				labels: parsedReadings.labels,
				datasets: [
					{
						label: displayValue,
						lineTension: 0.3,
						backgroundColor: 'rgba(75,192,192,0.4)',
						borderColor: 'rgba(75,192,192,1)',
						pointRadius: 0,
						pointHoverRadius: 0,
						pointHitRadius: 0,
						pointBorderWidth: 0,
						data: parsedReadings.data
					}
				]
			})
		})
	}, [sensorId, startDate, endDate, displayValue, labelSparsity])

	return <Line id='chart' data={data} />
}
