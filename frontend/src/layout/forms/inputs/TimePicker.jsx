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
	step,
	...props
}) {
	const [options, setOptions] = useState([])

	beginLimit = beginLimit ? beginLimit : '00:00'
	endLimit = endLimit ? endLimit : '23:59'
	step = step ? step : 15

	if (beginLimit && moreThanBeginLimit)
		beginLimit = moment(beginLimit, 'HH:mm')
			.add(step, 'minutes')
			.format('HH:mm')

	if (endLimit && lessThanEndLimit)
		endLimit = moment(endLimit, 'HH:mm')
			.subtract(step, 'minutes')
			.format('HH:mm')

	useEffect(() => {
		let _options = []
		let currentTime = beginLimit

		while (true) {
			_options.push({ label: currentTime, value: currentTime })

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
	}, [beginLimit, endLimit, step])

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
	step: PropTypes.number,
}

export default TimePicker
