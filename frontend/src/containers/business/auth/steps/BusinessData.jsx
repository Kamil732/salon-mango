import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import PhoneNumberInput from '../../../../layout/forms/inputs/PhoneNumberInput'
import { useTranslation } from 'react-i18next'

function BusinessData({
	onChange,
	updateData,
	business_name,
	name,
	phone_prefix,
	phone_number,
	errors,
	setErrors,
	componentData,
	changeComponentData,
}) {
	const { t } = useTranslation(['business_register', 'business_common'])

	// If valid form than changeComponentData({ nextBtnDisabled: false })
	useEffect(() => {
		if (
			componentData.nextBtnDisabled &&
			business_name &&
			name &&
			Object.keys(phone_prefix).length > 0 &&
			phone_number
		)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(business_name.length === 0 ||
				name.length === 0 ||
				Object.keys(phone_prefix).length === 0 ||
				phone_number.length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		business_name,
		name,
		phone_prefix,
		phone_number,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

	return (
		<>
			<div className="title-container">
				<h1>{t('business_data.title')}</h1>
				<p className="description">{t('business_data.description')}</p>
			</div>
			<FormControl>
				<Label htmlFor="business-name" inputValue={business_name}>
					{t('company_name', { ns: 'business_common' })}
				</Label>
				<Input
					required
					type="text"
					id="business-name"
					name="business_name"
					onChange={onChange}
					value={business_name}
					errors={errors?.business_name}
					setErrors={setErrors}
				/>
			</FormControl>
			<FormGroup>
				<FormControl>
					<Label htmlFor="name" inputValue={name}>
						{t('name', { ns: 'business_common' })}
					</Label>
					<Input
						required
						type="text"
						id="name"
						name="name"
						onChange={onChange}
						value={name}
						errors={errors?.name}
						setErrors={setErrors}
						min="3"
					/>
				</FormControl>
			</FormGroup>
			<PhoneNumberInput
				phone_prefix={phone_prefix}
				phone_number={phone_number}
				onChange={onChange}
				onChangePrefix={(val) => updateData({ phone_prefix: val })}
				errors={errors?.phone_number}
				setErrors={setErrors}
			/>
		</>
	)
}

BusinessData.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	updateData: PropTypes.func.isRequired,
	business_name: PropTypes.string,
	name: PropTypes.string,
	phone_prefix: PropTypes.string,
	phone_number: PropTypes.string,
	errors: PropTypes.object,
	setErrors: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default BusinessData
