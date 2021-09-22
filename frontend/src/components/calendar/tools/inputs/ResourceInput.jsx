import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadEmployees } from '../../../../redux/actions/data'

import Label from '../../../../layout/forms/inputs/Label'
import { FormControl } from '../../../../layout/forms/Forms'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

function ResourceInput({ value, resources, onChange, ...props }) {
	const [id] = useId(1, 'resource-')

	return (
		<FormControl>
			<Label htmlFor={id} inputValue={value?.name}>
				Zasób
			</Label>
			<Dropdown
				id={id}
				value={value}
				getOptionLabel={(option) => option.name}
				getOptionValue={(option) => option.id}
				getValuesValue={(option) => option.id}
				onChange={onChange}
				options={resources}
				{...props}
			/>
		</FormControl>
	)
}

ResourceInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	resources: PropTypes.array,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	resources: state.data.salon.resources,
})

const mapDispatchToProps = {
	loadEmployees,
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceInput)
