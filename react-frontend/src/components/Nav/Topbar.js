import React from 'react'
import './Topbar.css'
import { Logo } from '..'
import { default as MenuIcon } from './MenuIcon'

export default function Topbar({ setPage, setSidebarHidden }) {
	return (
		<header className='topbar'>
			<div id='menu' onClick={() => setSidebarHidden(false)}>
				<MenuIcon />
			</div>
			<div className='centerLogo'>
				<Logo onClick={() => setPage('home')} />
			</div>
		</header>
	)
}
