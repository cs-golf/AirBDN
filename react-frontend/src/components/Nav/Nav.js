import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

import './Nav.css'
import { useWindowSize } from '../hooks'

export default ({ setMapDisplayValue, page, setPage }) => {
	const [width, height] = useWindowSize()

	const [sidebarHidden, setSidebarHidden] = useState(true)

	return (
		<React.Fragment>
			{/* {(width > height || sidebarIsOpen) && ( */}
			<Sidebar
				sidebarHidden={sidebarHidden}
				setSidebarHidden={setSidebarHidden}
				page={page}
				setMapDisplayValue={setMapDisplayValue}
				setPage={setPage}
			/>
			{/* )} */}
			{width < height && <Topbar setPage={setPage} setSidebarHidden={setSidebarHidden} />}
		</React.Fragment>
	)
}
