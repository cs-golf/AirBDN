import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import './SensorPage.css'
import axios from 'axios'

<<<<<<< Updated upstream
const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "This sensor",
      fill: true,
      lineTension: 0.3,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      //   borderCapStyle: "butt",
      //   borderDash: [],
      //   borderDashOffset: 0.0,
      //   borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40] //to be connected to db and fetch wanted data
    }
  ]
};
=======
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
>>>>>>> Stashed changes

	const getReadings = (sensor = 'any', start = 'any', end = 'any') => {
		let out = axios
			.get(`/api/readings/sensor=${sensor}/start=${start}/end=${end}`)
			.then(resp => {
				return resp.data
			})
		console.log(data)
		// let filterData = (data, value) => data.filter(reading => reading[value])
		// console.log(response.data.map(reading => reading.timestamp.$date))
		// console.log(response.data.map(reading => reading))
		return out
	}

	const parseReadings = (readings, displayValue) => readings.map(r => console.log(r))

	// useEffect(() => {
	// 	parseReadings(getReadings(sensorId, '2020-02-15', '2020-02-16'), "pm10").then(d => {
	// 		// console.log(d)
	// 		setData(d)
	// 	})
	// }, [])

	return (
		<div id='chart'>
			<Line data={data} />
		</div>
	)
}

export default SensorPage
