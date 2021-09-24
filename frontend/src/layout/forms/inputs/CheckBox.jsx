import React from 'react'
import PropTypes from 'prop-types'
import '../../../assets/css/checkbox.css'

function CheckBox({ name, checked, onChange, ...props }) {
	return (
		<>
			<input
				type="checkbox"
				className="form-control__checkbox"
				name={name}
				checked={checked}
				onChange={onChange}
				{...props}
			/>
			<span className="form-control__checkbox-checkmark"></span>
		</>
	)
}

CheckBox.prototype.propTypes = {
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
}

function Label(props) {
	return <label className="form-control__checkbox-label" {...props} />
}

CheckBox.Label = Label

export default CheckBox
