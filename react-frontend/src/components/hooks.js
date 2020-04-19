import { useEffect, useState, useLayoutEffect } from 'react'

export function useOnClickAway(ref, func) {
	function handleClickOutside(event) {
		if (ref.current && !ref.current.contains(event.target)) {
			func()
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	})
}

export function useWindowSize() {
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
