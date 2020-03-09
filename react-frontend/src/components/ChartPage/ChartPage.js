import React from 'react'
import SensorChart from './SensorChart'

const SensorPage = ({ sensorId }) => {
	return (
		<SensorChart
			sensorId={sensorId}
			startDate={'2020-01-01'}
			endDate={'2020-01-04'}
			displayValue={'pm10'}
			labelSparsity={24}
		/>
	)
}

export default SensorPage
