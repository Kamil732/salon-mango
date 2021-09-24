import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/forms.css'

function FormControl({ children, ...props }) {
	return (
		<div className="form-control" {...props}>
			{children}
		</div>
	)
}

function FormControlInline({ children, ...props }) {
	return (
		<div className="form-control-inline" {...props}>
			{children}
		</div>
	)
}

function FormGroup({ wrap, ...props }) {
	return <div className={`form-group${wrap ? ' wrap' : ''}`} {...props} />
}

FormGroup.prototype.propTypes = {
	wrap: PropTypes.bool,
}

FormControl.Inline = FormControlInline

export { FormControl, FormGroup }
