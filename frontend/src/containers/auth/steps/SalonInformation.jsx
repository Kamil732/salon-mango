import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl, FormGroup } from '../../../layout/forms/Forms'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'

const countries = require('../../../helpers/data/countries.json')

function SalonInformation({
	onChange,
	updateData,
	salon_name,
	first_name,
	last_name,
	phone_prefix,
	phone_number,
	componentData,
	changeComponentData,
}) {
	// If valid form than changeComponentData({ nextBtnDisabled: false })
	useEffect(() => {
		if (
			componentData.nextBtnDisabled &&
			salon_name &&
			first_name &&
			last_name &&
			Object.keys(phone_prefix).length > 0 &&
			phone_number
		)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(salon_name.length === 0 ||
				first_name.length === 0 ||
				last_name.length === 0 ||
				Object.keys(phone_prefix).length === 0 ||
				phone_number.length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		salon_name,
		first_name,
		last_name,
		phone_prefix,
		phone_number,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

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
		<>
			<div className="title-container">
				<h1>O Tobie</h1>
				<p className="description">
					Dodaj informacje o sobie i swojej firmie
				</p>
			</div>
			<FormControl>
				<Label htmlFor="salon-name" inputValue={salon_name}>
					Nazwa firmy
				</Label>
				<Input
					required
					type="text"
					id="salon-name"
					name="salon_name"
					onChange={onChange}
					value={salon_name}
				/>
			</FormControl>
			<FormGroup>
				<FormControl>
					<Label htmlFor="first-name" inputValue={first_name}>
						Imię
					</Label>
					<Input
						required
						type="text"
						id="first-name"
						name="first_name"
						onChange={onChange}
						value={first_name}
						min="3"
					/>
				</FormControl>
				<FormControl>
					<Label htmlFor="last-name" inputValue={last_name}>
						Nazwisko
					</Label>
					<Input
						required
						type="text"
						id="last-name"
						name="last_name"
						onChange={onChange}
						value={last_name}
						min="3"
					/>
				</FormControl>
			</FormGroup>
			<FormGroup>
				<FormControl style={{ width: '6.5rem' }}>
					<Label
						htmlFor="phone-prefix"
						inputValue={Object.keys(phone_prefix).length > 0}
					>
						Prefix
					</Label>
					<Dropdown
						id="phone-prefix"
						required
						value={phone_prefix}
						getOptionValue={(opt) => opt.isoCode}
						getValuesValue={(opt) => opt.isoCode}
						formatOptionLabel={formatOptionLabel}
						formatSelectedOptionValue={formatSelectedOptionValue}
						onChange={(val) => updateData({ phone_prefix: val })}
						options={countries}
						searchable={['name', 'isoCode', 'dialCode']}
					/>
				</FormControl>
				<FormControl>
					<Label htmlFor="phone-number" inputValue={phone_number}>
						Numer telefonu
					</Label>
					<Input
						required
						type="text"
						id="phone-number"
						name="phone_number"
						onChange={onChange}
						value={phone_number}
					/>
				</FormControl>
			</FormGroup>
		</>
	)
}

SalonInformation.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	updateData: PropTypes.func.isRequired,
	salon_name: PropTypes.string,
	first_name: PropTypes.string,
	last_name: PropTypes.string,
	phone_prefix: PropTypes.string,
	phone_number: PropTypes.string,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default SalonInformation
