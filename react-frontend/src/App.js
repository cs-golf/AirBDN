import React, { useState } from 'react'
import { Map, Nav, ChartPage, About } from './components'
import './App.css'

const App = () => {
	// state
	const [page, setPage] = useState('home')
	const [mapDisplayValue, setMapDisplayValue] = useState('sensors')
	const [sensorId, setSensorId] = useState()
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

	const toggleSidebar = (bool = !sidebarIsOpen) => setSidebarIsOpen(bool)

	return (
		<React.Fragment>
			<Nav
				sidebarIsOpen={sidebarIsOpen}
				toggleSidebar={toggleSidebar}
				page={page}
				setPage={setPage}
				setMapDisplayValue={setMapDisplayValue}
			/>
			<div className={'pageContent'} onClick={() => toggleSidebar(false)}>
				{page === 'home' && (
					<Map
						mapDisplayValue={mapDisplayValue}
						setPage={setPage}
						setSensorId={setSensorId}
					/>
				)}
				{page === 'sensorPage' && <ChartPage sensorId={sensorId} />}
				{page === 'about' && <About />}
			</div>
		</React.Fragment>
	)
}

export default App
