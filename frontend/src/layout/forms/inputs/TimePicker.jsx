import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { timeValidation } from '../../../helpers/validations'
import Dropdown from '../../buttons/dropdowns/Dropdown'

function TimePicker({
	value,
	onChange,
	beginLimit,
	endLimit,
	moreThanBeginLimit,
	lessThanEndLimit,
	startTime,
	endTime,
	step,
	blockedHours,
	...props
}) {
	const [options, setOptions] = useState([])

	beginLimit = beginLimit ? beginLimit : '00:00'
	endLimit = endLimit ? endLimit : '23:59'
	step = step ? step : 15

	if (moreThanBeginLimit || endTime)
		beginLimit = moment(beginLimit, 'HH:mm')
			.add(endTime ? step * 2 : step, 'minutes')
			.format('HH:mm')

	if (lessThanEndLimit || startTime)
		endLimit = moment(endLimit, 'HH:mm')
			.subtract(startTime ? step * 2 : step, 'minutes')
			.format('HH:mm')

	useEffect(() => {
		let _options = []
		let currentTime = beginLimit

		while (true) {
			const newOption = { label: currentTime, value: currentTime }

			// if currentTime is in range of blockedHours than set option to disabled
			if (blockedHours?.length > 0)
				for (let i = 0; i < blockedHours.length; i++) {
					if (
						blockedHours[i][0] === value ||
						blockedHours[i][1] === value
					)
						continue

					const start = moment(blockedHours[i][0], 'HH:mm').subtract(
						endTime ? step : step * 2,
						'minutes'
					)
					const end = moment(blockedHours[i][1], 'HH:mm').add(
						startTime ? step : step * 2,
						'minutes'
					)

					if (moment(currentTime, 'HH:mm').isBetween(start, end)) {
						newOption.disabled = true
						break
					}
				}

			_options.push(newOption)

			if (
				moment(currentTime, 'HH:mm').isAfter(
					moment(endLimit, 'HH:mm')
				) ||
				moment(endLimit, 'HH:mm').diff(
					moment(currentTime, 'HH:mm'),
					'minutes'
				) < step
			)
				break

			currentTime = moment(currentTime, 'HH:mm')
				.add(step, 'minutes')
				.format('HH:mm')
		}

		setOptions(_options)
	}, [beginLimit, endLimit, step, blockedHours])

	return (
		<Dropdown
			value={{ label: value, value }}
			onChange={({ value }) => onChange(value)}
			options={options}
			getOptionLabel={(opt) => opt.label}
			getOptionValue={(opt) => opt.value}
			getValuesValue={(opt) => opt.value}
			formatOptionLabel={({ label }) => (
				<span className="word-break-all">{label}</span>
			)}
			editable
			regexValidation={timeValidation}
			{...props}
		/>
	)
}

TimePicker.prototype.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	beginLimit: PropTypes.string,
	endLimit: PropTypes.string,
	moreThanBeginLimit: PropTypes.bool,
	lessThanEndLimit: PropTypes.bool,
	blockedHours: PropTypes.array,
	startTime: PropTypes.bool,
	endTime: PropTypes.bool,
	step: PropTypes.number,
}

export default TimePicker
