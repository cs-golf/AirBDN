import React, { useRef, useEffect } from 'react'
import { useOnClickAway } from '../hooks'

import './Sidebar.css'
import { display } from '../../config.json'
import { Logo } from '..'

function Sidebar({ sidebarHidden, setSidebarHidden, setMapDisplayValue, page, setPage }) {
	const sidebar = useRef(null)

	useOnClickAway(sidebar, () => setSidebarHidden(true))

	let hideSidebar = bool =>
		bool ? sidebar.current.classList.add('hidden') : sidebar.current.classList.remove('hidden')

	useEffect(() => hideSidebar(sidebarHidden), [sidebarHidden])

	const pageNav = (
		<ul className='pageNav'>
			{Object.keys(display.pages).map(key => (
				<li className='listItem' key={key} onClick={() => setPage(key)}>
					{display.pages[key]}
				</li>
			))}
		</ul>
	)

	const mapValueNav = (
		<ul className='mapValueNav'>
			{Object.keys(display.values).map(key => (
				<li className='listItem' key={key} onClick={() => setMapDisplayValue(key)}>
					{display.values[key]}
				</li>
			))}
		</ul>
	)

	return (
		<div className='sidebar' ref={sidebar}>
			<Logo className='logo' onClick={() => setPage('home')} />
			{pageNav}
			{page === 'home' && mapValueNav}
		</div>
	)
}

export default Sidebar
