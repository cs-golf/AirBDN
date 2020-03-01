import React from 'react'

import './Sidebar.css'
import { display } from '../../config.json'
import { Logo } from '..'

function Sidebar({ setMapDisplayValue, page, setPage }) {
	const pageNav = (
		<ul className='pageNav'>
			{Object.keys(display.pages).map(key => (
				<li key={key} onClick={() => setPage(key)}>
					{display.pages[key]}
				</li>
			))}
		</ul>
	)

	const mapValueNav = (
		<ul className='mapValueNav'>
			{Object.keys(display.values).map(key => (
				<li key={key} onClick={() => setMapDisplayValue(key)}>
					{display.values[key]}
				</li>
			))}
		</ul>
	)

	return (
		<div className='sidebar'>
			<Logo className='logo' onClick={() => setPage('home')} />
			{pageNav}
			{page === 'home' && mapValueNav}
		</div>
	)
}

export default Sidebar
