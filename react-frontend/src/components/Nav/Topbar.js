import React from 'react'
import './Topbar.css'
import { Logo } from '..'
import { default as MenuIcon } from './MenuIcon'

export default function Topbar({ setPage, toggleSidebar }) {

	return (
		<header className='topbar'>
			<div id='menu' onClick={toggleSidebar}>
				<MenuIcon />
			</div>
			{/* <Logo onClick={() => setPage('home')} /> */}
		</header>
	)
}
