import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import useDebounce from '../../../../helpers/hooks/debounce'

import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'
import { useTranslation } from 'react-i18next'
import { COUNTRIES_DATA } from '../../../../app/locale/consts'

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
	updateData,
	setData,
	componentData,
	changeComponentData,
}) {
	const { t } = useTranslation('business_register')
	const [citiesLoading, setCitiesLoading] = useState(false)
	const [cities, setCities] = useState([])
	const debouncedSearch = useDebounce(postal_code, 500)

	useEffect(() => {
		if (
			componentData.nextBtnDisabled &&
			address &&
			postal_code &&
			Object.keys(city).length > 0
		)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(address.length === 0 ||
				postal_code.length === 0 ||
				Object.keys(city).length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		address,
		postal_code,
		city,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

	useEffect(() => {
		setData((prevData) => ({
			...prevData,
			city:
				Object.keys(prevData.city).length > 0 &&
				prevData.postal_code.length ===
					COUNTRIES_DATA[country].zipCodeLength
					? prevData.city
					: {},
		}))
	}, [postal_code, setData, country])

	useEffect(() => {
		if (
			debouncedSearch.length !== COUNTRIES_DATA[country].zipCodeLength &&
			cities.length > 0
		) {
			setCities([])
		}
	}, [debouncedSearch, cities, citiesLoading, country])

	useEffect(() => {
		if (debouncedSearch.length !== COUNTRIES_DATA[country].zipCodeLength)
			return
		setCitiesLoading(true)

		axios
			.get(
				`${process.env.REACT_APP_GEONAMES_SEARCH_POSTALCODE}?username=${process.env.REACT_APP_GEONAMES_USERNAME}&postalcode=${debouncedSearch}&country=${country}`
			)
			.then((res) => {
				if (res.data.postalCodes.length === 0) {
					setCities([])
					return
				}

				setCities(res.data.postalCodes)
			})
			.finally(() => setCitiesLoading(false))
	}, [debouncedSearch, country])

	return (
		<>
			<div className="title-container">
				<h2>{t('set_address.title')}</h2>
				<p className="description">{t('set_address.description')}</p>
			</div>

			<FormControl>
				<Label htmlFor="address" inputValue={address}>
					{t('set_address.address_label')}
				</Label>
				<Input
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
				<Label htmlFor="premises-number" inputValue={premises_number}>
					{t('set_address.premises_number_label')}
				</Label>
				<Input
					type="text"
					id="premises-number"
					name="premises_number"
					onChange={onChange}
					value={premises_number}
				/>
			</FormControl>
			<FormGroup>
				<FormControl style={{ width: '12rem' }}>
					<Label htmlFor="postal-code" inputValue={postal_code}>
						{t('set_address.postal_code_label')}
					</Label>
					<Input
						required
						type="text"
						id="postal-code"
						name="postal_code"
						onChange={onChange}
						value={postal_code}
						min={COUNTRIES_DATA[country].zipCodeLength}
						max={COUNTRIES_DATA[country].zipCodeLength}
					/>
				</FormControl>
				<FormControl>
					<Label
						htmlFor="city"
						inputValue={Object.keys(city).length > 0}
					>
						{t('set_address.city_label')}
					</Label>

					<Dropdown
						id="city"
						value={city}
						getOptionLabel={(opt) => opt.placeName}
						getOptionValue={(opt) => opt.placeName}
						getValuesValue={(opt) => opt.placeName}
						onChange={(val) => {
							updateData({
								city: val,
								latitude: parseFloat(val.lat),
								longitude: parseFloat(val.lng),
							})
						}}
						options={cities}
						isLoading={citiesLoading}
						disabled={
							debouncedSearch.length !==
							COUNTRIES_DATA[country].zipCodeLength
						}
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
	updateData: PropTypes.func.isRequired,
	setData: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default SetAddress
