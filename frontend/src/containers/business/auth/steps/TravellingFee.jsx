import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup } from '../../../../layout/forms/Forms'

import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import Textarea from '../../../../layout/forms/inputs/Textarea'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

import {
	GoogleMap,
	Marker,
	Circle,
	useJsApiLoader,
} from '@react-google-maps/api'
import { useTranslation } from 'react-i18next'

import {
	PRICE_TYPES,
	TRAVEL_FEE_PRICE_TYPES_DATA,
	MAX_TRAVEL_DISTANCES,
} from '../../../../helpers/consts'

function TravellingFee({
	billing_type,
	travel_fee,
	max_travel_distance,
	travel_fee_rules,
	latitude,
	longitude,
	updateData,
	onChange,
}) {
	const { t } = useTranslation(['business_register', 'business_common'])
	const getOptionValue = (opt) => opt.value
	const getOptionLabel = (opt) => opt.label
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	})
	const [zoom, setZoom] = useState(max_travel_distance.zoom)

	const center = {
		lat: latitude,
		lng: longitude,
	}

	const circleOptions = {
		strokeColor: '#000',
		strokeOpacity: 0.3,
		strokeWeight: 2,
		fillColor: '$000',
		fillOpacity: 0.15,
		radius: getOptionValue(max_travel_distance),
	}

	return (
		<>
			<div className="title-container">
				<h2>{t('travelling_fee.title')}</h2>
				<p className="description">{t('travelling_fee.description')}</p>
			</div>

			<FormGroup>
				<FormControl>
					<Label htmlFor="billing-type" inputValue>
						{t('price_types.name', { ns: 'business_common' })}
					</Label>
					<Dropdown
						id="billing-type"
						value={billing_type}
						options={TRAVEL_FEE_PRICE_TYPES_DATA}
						getOptionLabel={getOptionLabel}
						getOptionValue={getOptionValue}
						getValuesValue={getOptionValue}
						onChange={(val) =>
							updateData({
								billing_type: val,
								travel_fee:
									getOptionValue(val) ===
									getOptionValue(PRICE_TYPES.FREE)
										? 0
										: getOptionValue(val) ===
										  getOptionValue(PRICE_TYPES.VARIES)
										? null
										: travel_fee === null
										? 0
										: travel_fee,
							})
						}
					/>
				</FormControl>
				<FormControl>
					<Label
						htmlFor="travel-fee"
						inputValue={
							travel_fee === null || travel_fee.toString()
						}
					>
						{t('travelling_fee.travel_fee_label')}
					</Label>
					<Input
						id="travel-fee"
						name="travel_fee"
						type={travel_fee === null ? 'text' : 'number'}
						value={travel_fee === null ? '-' : travel_fee}
						onChange={onChange}
						disabled={
							getOptionValue(billing_type) ===
								getOptionValue(PRICE_TYPES.FREE) ||
							getOptionValue(billing_type) ===
								getOptionValue(PRICE_TYPES.VARIES)
						}
					/>
				</FormControl>
			</FormGroup>
			<FormControl>
				<Label htmlFor="max-travel-distance" inputValue>
					{t('travelling_fee.max_travel_distance_label')}
				</Label>
				<Dropdown
					id="max-travel-distance"
					value={max_travel_distance}
					options={MAX_TRAVEL_DISTANCES}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					getValuesValue={getOptionValue}
					onChange={(val) => {
						updateData({ max_travel_distance: val })
						setZoom(val.zoom)
					}}
				/>
			</FormControl>
			{isLoaded && (
				<GoogleMap
					mapContainerStyle={{
						width: '100%',
						height: '400px',
					}}
					center={center}
					zoom={zoom}
				>
					<Marker
						position={{
							lat: latitude,
							lng: longitude,
						}}
					/>
					<Circle center={center} options={circleOptions} />
				</GoogleMap>
			)}
			<FormControl>
				<Label htmlFor="travel-fee-rules" inputValue={travel_fee_rules}>
					{t('travelling_fee.travel_fee_rules_label')}
				</Label>
				<Textarea
					id="travel-fee-rules"
					name="travel_fee_rules"
					value={travel_fee_rules}
					onChange={onChange}
				/>
			</FormControl>
		</>
	)
}

TravellingFee.prototype.propTypes = {
	billing_type: PropTypes.shape({
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
			.isRequired,
	}).isRequired,
	travel_fee: PropTypes.number,
	max_travel_distance: PropTypes.shape({
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
			.isRequired,
	}).isRequired,
	travel_fee_rules: PropTypes.string,
	updateData: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default TravellingFee
