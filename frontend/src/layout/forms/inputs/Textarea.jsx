import React from 'react'
import PropTypes from 'prop-types'
import '../../../assets/css/textarea.css'

import TextareaAutosize from 'react-textarea-autosize'

function Textarea({ errors, ...props }) {
	return (
		<>
			<TextareaAutosize
				className="form-control__input form-control__textarea"
				title={props.required ? 'Proszę wypełnij to pole' : ''}
				{...props}
			/>
			{errors?.length > 0 ? (
				<div className="form-control__errors">
					{errors.map((error, idx) => (
						<span key={idx}>{error}</span>
					))}
				</div>
			) : (
				<span className="form-control__input__border"></span>
			)}
		</>
	)
}

Textarea.prototype.propTypes = {
	errors: PropTypes.array,
}

export default Textarea
