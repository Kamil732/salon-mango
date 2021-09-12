import { useEffect } from 'react'

function useClickOutside(ref, handler) {
	useEffect(() => {
		const listener = (e) => {
			if (
				ref.current &&
				!ref.current.contains(e.target) &&
				e.offsetX <= e.target.clientWidth - 1 &&
				e.offsetY <= e.target.clientHeight - 1
			)
				handler()
		}

		document.addEventListener('mousedown', listener)

		return () => {
			document.removeEventListener('mousedown', listener)
		}
	}, [ref, handler])
}

export default useClickOutside
