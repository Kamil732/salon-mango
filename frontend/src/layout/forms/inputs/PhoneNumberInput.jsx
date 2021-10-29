import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Dropdown from '../../buttons/dropdowns/Dropdown'
import { FormControl, FormGroup } from '../Forms'
import Input from './Input'
import Label from './Label'

const countries = require('../../../assets/data/countries.json')

function PhoneNumberInput({
	phone_prefix,
	phone_number,
	onChange,
	onChangePrefix,
	required,
	errors,
}) {
	const { t } = useTranslation('business_common')

	const formatOptionLabel = ({ dialCode, name }) => (
		<div className="inline-wrap">
			<span>{dialCode}</span> |{' '}
			<span className="text-broken">{name}</span>
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
					{t('prefix')}
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
					{t('phone_number')}
				</Label>
				<Input
					required={required}
					type="text"
					id="phone-number"
					name="phone_number"
					onChange={onChange}
					value={phone_number}
					errors={errors}
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
	errors: PropTypes.array,
}

export default PhoneNumberInput
