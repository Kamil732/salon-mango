import { useEffect, useState } from 'react'

function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

export const withDebounce = (WrappedComponent, delay) => (props) => {
	const [value, setValue] = useState('')
	const debouncedValue = useDebounce(value, delay)

	return (
		<WrappedComponent
			{...props}
			debouncedValue={debouncedValue}
			setDebouncedValue={setValue}
		/>
	)
}

export default useDebounce
