import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'

import { loadCustomers } from '../../../../redux/actions/data'

import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import Label from '../../../../layout/forms/inputs/Label'
import Button from '../../../../layout/buttons/Button'
import Dropdown, {
	DropdownClearBtn,
	DropdownInputContainer,
} from '../../../../layout/buttons/dropdowns/Dropdown'

function CustomerInput({
	value,
	options,
	customers,
	onChange,
	changeForm,
	loadCustomers,
	...props
}) {
	const [id] = useId(1, 'customer-')

	return (
		<FormGroup>
			<DropdownInputContainer>
				<FormControl>
					<Label htmlFor={id} inputValue={value?.full_name}>
						Klient
					</Label>

					<Dropdown
						id={id}
						getOptionLabel={(option) => option.full_name}
						getOptionValue={(option) => option.id}
						getValuesValue={(option) => option.id}
						onChange={onChange}
						value={value}
						searchAsync
						options={options?.length > 0 ? options : customers}
						loadOptions={loadCustomers}
						{...props}
					/>
				</FormControl>
				<DropdownClearBtn
					clear={() => onChange({})}
					value={Object.keys(value).length > 0}
				/>
			</DropdownInputContainer>
			{!value?.full_name && (
				<Button type="button" small primary onClick={changeForm}>
					Nowy
				</Button>
			)}
		</FormGroup>
	)
}

CustomerInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	options: PropTypes.array,
	customers: PropTypes.array,
	loadCustomers: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	changeForm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	customers: state.data.business.customers.data,
})

const mapDispatchToProps = {
	loadCustomers,
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInput)
