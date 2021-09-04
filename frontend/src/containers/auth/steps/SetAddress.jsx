import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FormControl from '../../../layout/forms/FormControl'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'
import useDebounce from '../../../helpers/hooks/debounce'
import axios from 'axios'
import FormGroup from '../../../layout/forms/FormGroup'

function SetAddress({
	country,
	address,
	premises_number,
	city,
	postal_code,
	share_premises,
	common_premises_name,
	common_premises_number,
	onChange,
	onChangeDropdown,
}) {
	const [citiesLoading, setCitiesLoading] = useState(false)
	const [cities, setCities] = useState([])
	const debouncedSearch = useDebounce(postal_code, 500)

	useEffect(() => {
		if (debouncedSearch.length !== 6) return
		setCitiesLoading(true)

		axios
			.get(
				`https://app.zipcodebase.com/api/v1/search?codes=${debouncedSearch}&country=${country}&apikey=d8d66b60-0b62-11ec-96f1-4fef55f384da`
			)
			.then((res) => {
				if (res.data.results.length === 0) {
					setCities([])
					return
				}
				setCities(res.data.results[res.data.query.codes[0]])
			})

		setCitiesLoading(false)
	}, [debouncedSearch, country])

	return (
		<>
			<div className="title">
				<h2>Twój adres</h2>
				<p>Gdzie można cię znaleźć?</p>
			</div>

			<FormControl>
				<FormControl.Label htmlFor="address" inputValue={address}>
					Ulica i numer domu
				</FormControl.Label>
				<FormControl.Input
					required
					type="text"
					id="address"
					name="address"
					onChange={onChange}
					value={address}
					min="3"
				/>
			</FormControl>
			<FormControl>
				<FormControl.Label
					htmlFor="premises-number"
					inputValue={premises_number}
				>
					Numer lokalu (opcjonalne)
				</FormControl.Label>
				<FormControl.Input
					type="text"
					id="premises-number"
					name="premises_number"
					onChange={onChange}
					value={premises_number}
				/>
			</FormControl>
			<FormGroup>
				<FormControl style={{ width: '12rem' }}>
					<FormControl.Label
						htmlFor="postal-code"
						inputValue={postal_code}
					>
						Kod pocztowy
					</FormControl.Label>
					<FormControl.Input
						required
						type="text"
						id="postal-code"
						name="postal_code"
						onChange={onChange}
						value={postal_code}
						min="6"
						max="6"
					/>
				</FormControl>
				<FormControl>
					<FormControl.Label
						htmlFor="city"
						inputValue={Object.keys(city).length > 0}
					>
						Miejscowość
					</FormControl.Label>

					<Dropdown
						id="city"
						value={city}
						getOptionLabel={(opt) => opt.city}
						getOptionValue={(opt) => opt.city}
						getValuesValue={(opt) => opt.city}
						onChange={(val) => onChangeDropdown('city', val)}
						options={cities}
						isLoading={citiesLoading}
						disabled={debouncedSearch.length !== 6}
					/>
				</FormControl>
			</FormGroup>
		</>
	)
}

SetAddress.prototype.propTypes = {
	country: PropTypes.string,
	address: PropTypes.string,
	premises_number: PropTypes.string,
	city: PropTypes.string,
	postal_code: PropTypes.string,
	share_premises: PropTypes.bool,
	common_premises_name: PropTypes.string,
	common_premises_number: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onChangeDropdown: PropTypes.func.isRequired,
}

export default SetAddress
