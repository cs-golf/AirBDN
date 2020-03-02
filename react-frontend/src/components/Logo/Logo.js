import React from 'react'
import './Logo.css'

export default ({ onClick }) => (
	<div className='logo' onClick={onClick}>
		<img src='logo512s.png' alt='logo' />
		AirBDN
	</div>
)
