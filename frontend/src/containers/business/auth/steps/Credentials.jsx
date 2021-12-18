import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import { useTranslation } from 'react-i18next'

function Credentials({
	onChange,
	password,
	confirm_password,
	componentData,
	changeComponentData,
	errors,
}) {
	const { t } = useTranslation(['business_register', 'auth'])

	useEffect(() => {
		if (componentData.nextBtnDisabled && password && confirm_password)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(password.length === 0 || confirm_password.length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		password,
		confirm_password,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

	return (
		<>
			<div className="title-container">
				<h1>{t('credentials.title')}</h1>
				<p className="description">{t('credentials.description')}</p>
			</div>
			<FormControl>
				<Label htmlFor="password" inputValue={password}>
					{t('password', { ns: 'auth' })}
				</Label>
				<Input
					required
					type="password"
					id="password"
					name="password"
					onChange={onChange}
					value={password}
					errors={errors?.confirm_password}
					min="6"
				/>
			</FormControl>
			<FormControl>
				<Label htmlFor="confirm_password" inputValue={confirm_password}>
					{t('confirm_password', { ns: 'auth' })}
				</Label>
				<Input
					required
					type="password"
					id="confirm_password"
					name="confirm_password"
					onChange={onChange}
					value={confirm_password}
					errors={errors?.confirm_password}
					min="6"
				/>
			</FormControl>
		</>
	)
}

Credentials.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	password: PropTypes.string,
	confirm_password: PropTypes.string,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
	errors: PropTypes.object,
}

export default Credentials
