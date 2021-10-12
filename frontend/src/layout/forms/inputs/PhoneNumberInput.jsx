import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from '../../buttons/dropdowns/Dropdown'
import { FormControl, FormGroup } from '../Forms'
import Input from './Input'
import Label from './Label'

const countries = require('../../../helpers/data/countries.json')

function PhoneNumberInput({
	phone_prefix,
	phone_number,
	onChange,
	onChangePrefix,
	required,
}) {
	const formatOptionLabel = ({ dialCode, name }) => (
		<div className="inline-wrap">
			<span>{dialCode}</span> | <span>{name}</span>
		</div>
	)

	const formatSelectedOptionValue = ({ flag, isoCode, dialCode }) => (
		<div className="inline-wrap">
			<img src={flag} alt={isoCode} width={26} height={26} />
			<span>{dialCode}</span>
		</div>
	)

	return (
		<FormGroup>
			<FormControl style={{ width: '7rem' }}>
				<Label
					htmlFor="phone-prefix"
					inputValue={Object.keys(phone_prefix).length > 0}
				>
					Prefix
				</Label>
				<Dropdown
					id="phone-prefix"
					required={required}
					value={phone_prefix}
					getOptionValue={(opt) => opt.isoCode}
					getValuesValue={(opt) => opt.isoCode}
					formatOptionLabel={formatOptionLabel}
					formatSelectedOptionValue={formatSelectedOptionValue}
					onChange={onChangePrefix}
					options={countries}
					searchable={['name', 'isoCode', 'dialCode']}
				/>
			</FormControl>
			<FormControl>
				<Label htmlFor="phone-number" inputValue={phone_number}>
					Numer telefonu
				</Label>
				<Input
					required={required}
					type="text"
					id="phone-number"
					name="phone_number"
					onChange={onChange}
					value={phone_number}
				/>
			</FormControl>
		</FormGroup>
	)
}

PhoneNumberInput.prototype.propTypes = {
	phone_prefix: PropTypes.object,
	phone_number: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onChangePrefix: PropTypes.func.isRequired,
	required: PropTypes.bool,
}

export default PhoneNumberInput
