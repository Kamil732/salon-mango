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

function FormGroup({ wrap, className, ...props }) {
	className = className ? className : ''
	return (
		<div
			className={`form-group${wrap ? ' wrap' : ''} ${className}`}
			{...props}
		/>
	)
}

FormGroup.prototype.propTypes = {
	wrap: PropTypes.bool,
}

function Prefix(props) {
	return <div className="form-control__prefix" {...props} />
}

FormControl.Inline = FormControlInline
FormControl.Prefix = Prefix

export { FormControl, FormGroup }
