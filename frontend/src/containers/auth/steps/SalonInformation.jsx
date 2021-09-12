import React from 'react'
import PropTypes from 'prop-types'

import FormGroup from '../../../layout/forms/FormGroup'
import FormControl from '../../../layout/forms/FormControl'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'

const countries = require('../../../helpers/data/countries.json')

function SalonInformation({
	onChange,
	setData,
	salon_name,
	first_name,
	last_name,
	phone_prefix,
	phone_number,
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
		<>
			<div className="title">
				<h1>O Tobie</h1>
				<p>Dodaj informacje o sobie i swojej firmie</p>
			</div>
			<FormControl>
				<FormControl.Label htmlFor="salon-name" inputValue={salon_name}>
					Nazwa firmy
				</FormControl.Label>
				<FormControl.Input
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
					<FormControl.Label
						htmlFor="first-name"
						inputValue={first_name}
					>
						Imię
					</FormControl.Label>
					<FormControl.Input
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
					<FormControl.Label
						htmlFor="last-name"
						inputValue={last_name}
					>
						Nazwisko
					</FormControl.Label>
					<FormControl.Input
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
					<FormControl.Label
						htmlFor="phone-prefix"
						inputValue={Object.keys(phone_prefix).length > 0}
					>
						Prefix
					</FormControl.Label>
					<Dropdown
						id="phone-prefix"
						required
						value={phone_prefix}
						getOptionValue={(opt) => opt.isoCode}
						getValuesValue={(opt) => opt.isoCode}
						formatOptionLabel={formatOptionLabel}
						formatSelectedOptionValue={formatSelectedOptionValue}
						onChange={(val) => setData({ phone_prefix: val })}
						options={countries}
						searchable={['name', 'isoCode', 'dialCode']}
					/>
				</FormControl>
				<FormControl>
					<FormControl.Label
						htmlFor="phone-number"
						inputValue={phone_number}
					>
						Numer telefonu
					</FormControl.Label>
					<FormControl.Input
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
	setData: PropTypes.func.isRequired,
	salon_name: PropTypes.string,
	first_name: PropTypes.string,
	last_name: PropTypes.string,
	phone_prefix: PropTypes.string,
	phone_number: PropTypes.string,
}

export default SalonInformation
