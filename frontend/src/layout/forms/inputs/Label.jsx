import React from 'react'
import PropTypes from 'prop-types'
import '../../../assets/css/label.css'

function Label({ inputValue, ...props }) {
	return (
		<label
			className={`form-control__label${inputValue ? ' active' : ''}`}
			{...props}
		/>
	)
}

Label.prototype.propTypes = {
	inputValue: PropTypes.any.isRequired,
}

export default Label
