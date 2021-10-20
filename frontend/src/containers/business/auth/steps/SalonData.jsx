import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import PhoneNumberInput from '../../../../layout/forms/inputs/PhoneNumberInput'
import { useTranslation } from 'react-i18next'

function SalonData({
	onChange,
	updateData,
	salon_name,
	name,
	phone_prefix,
	phone_number,
	componentData,
	changeComponentData,
}) {
	const { t } = useTranslation()

	// If valid form than changeComponentData({ nextBtnDisabled: false })
	useEffect(() => {
		if (
			componentData.nextBtnDisabled &&
			salon_name &&
			name &&
			Object.keys(phone_prefix).length > 0 &&
			phone_number
		)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(salon_name.length === 0 ||
				name.length === 0 ||
				Object.keys(phone_prefix).length === 0 ||
				phone_number.length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		salon_name,
		name,
		phone_prefix,
		phone_number,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

	return (
		<>
			<div className="title-container">
				<h1>{t('auth.register.salon_data.title')}</h1>
				<p className="description">
					{t('auth.register.salon_data.description')}
				</p>
			</div>
			<FormControl>
				<Label htmlFor="salon-name" inputValue={salon_name}>
					{t('data.company_name')}
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
					<Label htmlFor="name" inputValue={name}>
						{t('data.name')}
					</Label>
					<Input
						required
						type="text"
						id="first-name"
						name="name"
						onChange={onChange}
						value={name}
						min="3"
					/>
				</FormControl>
			</FormGroup>
			<PhoneNumberInput
				phone_prefix={phone_prefix}
				phone_number={phone_number}
				onChange={onChange}
				onChangePrefix={(val) => updateData({ phone_prefix: val })}
			/>
		</>
	)
}

SalonData.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	updateData: PropTypes.func.isRequired,
	salon_name: PropTypes.string,
	name: PropTypes.string,
	phone_prefix: PropTypes.string,
	phone_number: PropTypes.string,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default SalonData
