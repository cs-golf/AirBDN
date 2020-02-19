import React, { useState } from 'react'
import { Map, Sidebar, SensorPage, About, Datadownload } from './components'

const App = () => {
	// state
	const [page, setPage] = useState('home')
	const [targetValue, setTargetValue] = useState('sensors')
	const [sensorId, setSensorId] = useState()

	return (
		<React.Fragment>
			<Sidebar setTargetValue={setTargetValue} setPage={setPage} page={page} />
			{page === 'home' && (
				<Map targetValue={targetValue} setPage={setPage} setSensorId={setSensorId} />
			)}
			{page === 'sensorPage' && <SensorPage sensorId={sensorId} />}
			{page === 'about' && <About />}
			{/* {page === "DataDownload" && <Datadownload />} */}
		</React.Fragment>
	)
}

export default App
