import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import Label from '../../../../layout/forms/inputs/Label'
import { FormControl } from '../../../../layout/forms/Forms'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

function EmployeeInput({
	value,
	extraOptions,
	serviceId,
	serviceDisplayTime,
	options,
	employees,
	onChange,
	...props
}) {
	const [id] = useId(1, 'employee-')

	const getOptionLabel = (option) => option.name

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
			<Label htmlFor={id} inputValue={value?.name}>
				Fryzjer
			</Label>
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
	onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	employees: state.data.business.employees,
})

export default connect(mapStateToProps, null)(EmployeeInput)
