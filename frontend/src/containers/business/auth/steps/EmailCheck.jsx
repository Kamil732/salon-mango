import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { FormControl } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'

function EmailCheck({
	email,
	errors,
	setErrors,
	onChange,
	componentData,
	changeComponentData,
}) {
	const { t } = useTranslation(['business_register', 'auth'])

	useEffect(() => {
		if (email.length === 0 && !componentData.nextBtnDisabled)
			changeComponentData({
				nextBtnDisabled: true,
			})
		else if (email.length > 0 && componentData.nextBtnDisabled)
			changeComponentData({
				nextBtnDisabled: false,
			})
	}, [email, componentData.nextBtnDisabled, changeComponentData])

	return (
		<>
			<div className="title-container">
				<h1>{t('email_check.title')}</h1>
			</div>
			<FormControl>
				<Label htmlFor="email" inputValue={email}>
					{t('email', { ns: 'auth' })}
				</Label>
				<Input
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={onChange}
					errors={errors?.email}
					setErrors={setErrors}
				/>
			</FormControl>
		</>
	)
}

EmailCheck.prototype.propTypes = {
	email: PropTypes.string.isRequired,
	errors: PropTypes.object.isRequired,
	setErrors: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default EmailCheck
