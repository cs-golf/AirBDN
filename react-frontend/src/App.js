import React, { useState } from 'react'
import { Map, Nav, SensorPage, About } from './components'

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
			<div onClick={() => toggleSidebar(false)}>
				{page === 'home' && (
					<Map
						mapDisplayValue={mapDisplayValue}
						setPage={setPage}
						setSensorId={setSensorId}
					/>
				)}
				{page === 'sensorPage' && <SensorPage sensorId={sensorId} />}
				{page === 'about' && <About />}
			</div>
		</React.Fragment>
	)
}

export default App
