import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../../layout/forms/Forms'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import { useTranslation } from 'react-i18next'

function Credentials({
	onChange,
	email,
	password,
	confirm_password,
	componentData,
	changeComponentData,
}) {
	const { t } = useTranslation(['business_register', 'auth'])

	useEffect(() => {
		if (
			componentData.nextBtnDisabled &&
			email &&
			password &&
			confirm_password
		)
			changeComponentData({ nextBtnDisabled: false })
		else if (
			!componentData.nextBtnDisabled &&
			(email.length === 0 ||
				password.length === 0 ||
				confirm_password.length === 0)
		)
			changeComponentData({ nextBtnDisabled: true })
	}, [
		email,
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
				<Label htmlFor="email" inputValue={email}>
					{t('email', { ns: 'auth' })}
				</Label>
				<Input
					required
					type="text"
					id="email"
					name="email"
					onChange={onChange}
					value={email}
				/>
			</FormControl>
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
					min="6"
				/>
			</FormControl>
		</>
	)
}

Credentials.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	email: PropTypes.string,
	password: PropTypes.string,
	confirm_password: PropTypes.string,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default Credentials
