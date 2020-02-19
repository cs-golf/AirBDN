import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import './SensorPage.css'
import axios from 'axios'

const SensorPage = ({ sensorId }) => {
	const [data, setData] = useState({
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				lineTension: 0.3,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)',
				pointRadius: 2,
				pointHoverRadius: 8,
				pointHitRadius: 10,
				pointBorderWidth: 4,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(75,192,192,1)',
				label: 'My First dataset',
				data: [65, 59, 80, 81, 56, 55, 40]
			}
		]
	})

	const getReadings = (sensor = 'any', start = 'any', end = 'any') =>
		axios
			.get(`/api/readings/sensor=${sensor}/start=${start}/end=${end}`)
			.then(resp => resp.data)

	const parseReadings = (readings, displayValue = 'pm10') => ({
		labels: readings.filter(r => r[displayValue]).map(r => r.timestamp.$date),
		data: readings.filter(r => r[displayValue]).map(r => r[displayValue])
	})

	useEffect(() => {
		getReadings(sensorId, '2020-02-15', '2020-02-16').then(d => {
			let parsedReadings = parseReadings(d)
			let newData = data
			newData.datasets[0].data = parsedReadings.data
			newData.labels = parsedReadings.labels
			setData(newData)
		})
	}, [sensorId])

	return (
		<div id='chart'>
			<Line data={data} />
		</div>
	)
}

export default SensorPage
