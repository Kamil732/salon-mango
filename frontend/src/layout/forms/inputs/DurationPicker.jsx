import React from 'react'
import PropTypes from 'prop-types'

import Label from './Label'
import { FormControl, FormGroup } from '../Forms'
import Dropdown from '../../buttons/dropdowns/Dropdown'

function DurationPicker({ value, onChange }) {
	const hours = []
	while (hours.length < 24)
		hours.push({ label: `${hours.length}h`, value: hours.length })

	const minutes = []
	for (let i = 0; i < 60; i += 5) minutes.push({ label: `${i}m`, value: i })

	const h = Math.floor(value / 60)
	const m = Math.round(value % 60)

	const getOptionLabel = (opt) => opt.label
	const getOptionValue = (opt) => opt.value

	return (
		<FormGroup>
			<FormControl>
				<Label htmlFor="duration-hours" inputValue>
					Godz.
				</Label>
				<Dropdown
					id="duration-hours"
					value={{
						label: `${h}h`,
						value: h,
					}}
					onChange={({ value }) => onChange(value * 60 + m)}
					options={hours}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					getValuesValue={getOptionValue}
				/>
			</FormControl>
			<FormControl>
				<Label htmlFor="duration-minutes" inputValue>
					Min.
				</Label>
				<Dropdown
					id="duration-minutes"
					value={{
						label: `${m}m`,
						value: m,
					}}
					onChange={({ value }) => onChange(value + h * 60)}
					options={minutes}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					getValuesValue={getOptionValue}
				/>
			</FormControl>
		</FormGroup>
	)
}

DurationPicker.prototype.propTypes = {
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
}

export default DurationPicker
