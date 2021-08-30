import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadEmployees } from '../../../../redux/actions/data'

import FormControl from '../../../../layout/forms/FormControl'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

function EmployeeInput({
	value,
	extraOptions,
	serviceId,
	serviceDisplayTime,
	options,
	employees,
	loadEmployees,
	onChange,
	...props
}) {
	const [id] = useId(1, 'employee-')

	useEffect(() => {
		if (employees.length === 0) loadEmployees()
	}, [employees, loadEmployees])

	const getOptionLabel = (option) => option.full_name

	const formatOptionLabel = (option) => {
		const time = serviceId
			? option.services_data.find(({ service }) => service === serviceId)
					?.display_time || serviceDisplayTime
			: null

		if (time == null) return getOptionLabel(option)

		return `${getOptionLabel(option)} (${time})`
	}

	return (
		<FormControl>
			<FormControl.Label htmlFor={id} inputValue={value?.full_name}>
				Fryzjer
			</FormControl.Label>
			<Dropdown
				id={id}
				value={value}
				getOptionLabel={getOptionLabel}
				getOptionValue={(option) => option.id}
				getValuesValue={(option) => option.id}
				formatOptionLabel={formatOptionLabel}
				onChange={onChange}
				options={
					extraOptions?.length > 0
						? [...extraOptions, ...employees]
						: options?.length > 0
						? options
						: employees
				}
				{...props}
			/>
		</FormControl>
	)
}

EmployeeInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	employees: PropTypes.array,
	extraOptions: PropTypes.array,
	options: PropTypes.array,
	loadEmployees: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	employees: state.data.employees,
})

const mapDispatchToProps = {
	loadEmployees,
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeInput)