import React from 'react'
import '../../../assets/css/textarea.css'

import TextareaAutosize from 'react-textarea-autosize'

function Textarea(props) {
	return (
		<>
			<TextareaAutosize
				className="form-control__input form-control__textarea"
				title={props.required ? 'Proszę wypełnij to pole' : ''}
				{...props}
			/>
			<span className="form-control__input__border"></span>
		</>
	)
}

export default Textarea
