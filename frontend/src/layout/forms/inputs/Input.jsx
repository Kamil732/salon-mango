import React from 'react'
import '../../../assets/css/input.css'

function Input(props) {
	return (
		<>
			<input
				className="form-control__input"
				title={props.required ? 'Proszę wypełnij to pole' : ''}
				{...props}
			/>
			<span className="form-control__input__border"></span>
		</>
	)
}

export default Input
