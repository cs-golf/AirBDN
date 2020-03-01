import React, { useState, useLayoutEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

import './Nav.css'

function useWindowSize() {
	const [size, setSize] = useState([0, 0])
	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight])
		}
		window.addEventListener('resize', updateSize)
		updateSize()
		return () => window.removeEventListener('resize', updateSize)
	}, [])
	return size
}

export default ({ setMapDisplayValue, page, setPage, sidebarIsOpen, toggleSidebar }) => {
	const [width, height] = useWindowSize()

	return (
		<React.Fragment>
			{(width > height || sidebarIsOpen) && (
				<Sidebar page={page} setMapDisplayValue={setMapDisplayValue} setPage={setPage} />
			)}
			{width < height && <Topbar setPage={setPage} toggleSidebar={toggleSidebar} />}
		</React.Fragment>
	)
}
