import React, { useState } from 'react'
import { Map, Nav, ChartPage, About, HelpPage } from './components'
import './App.css'

const App = () => {
	// state
	const [page, setPage] = useState('home')
	const [mapDisplayValue, setMapDisplayValue] = useState('sensors')
	const [sensorId, setSensorId] = useState()

	return (
		<React.Fragment>
			<Nav page={page} setPage={setPage} setMapDisplayValue={setMapDisplayValue} />
			<div className={'pageContent'}>
				{page === 'home' && (
					<Map
						mapDisplayValue={mapDisplayValue}
						setPage={setPage}
						setSensorId={setSensorId}
					/>
				)}
				{page === 'sensorPage' && <ChartPage sensorId={sensorId} />}
				{page === 'about' && <About />}
				{page === 'help' && <HelpPage />}
			</div>
		</React.Fragment>
	)
}

export default App
