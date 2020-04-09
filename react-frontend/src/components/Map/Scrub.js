import React, { useState, useRef, useEffect } from 'react'
import './Scrub.css'
import { useOnClickAway } from '../hooks'

let Scrub = ({ scrubValue, setScrubValue }) => {
	const popUp = useRef(null)
	let toggleScrub = (bool = !popUp.current.classList.contains('active')) =>
		bool ? popUp.current.classList.add('active') : popUp.current.classList.remove('active')

	useOnClickAway(popUp, () => toggleScrub(false))

	return (
		<div className='popUp' ref={popUp}>
			<input
				type='range'
				className='scrub'
				min={0}
				max={9999}
				value={scrubValue}
				onChange={e => setScrubValue(e.target.value)}
			/>
			<button className='toggle' onClick={() => toggleScrub()}>
				^
			</button>
		</div>
	)
}

export default Scrub
