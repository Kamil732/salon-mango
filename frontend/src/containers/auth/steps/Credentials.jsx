import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../layout/forms/Forms'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'

function Credentials({
	onChange,
	email,
	password,
	confirm_password,
	componentData,
	changeComponentData,
}) {
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
				<h1>Ustaw logowanie</h1>
				<p className="description">
					Ustaw email i hasło, za pomocą którego będziesz się logować
				</p>
			</div>
			<FormControl>
				<Label htmlFor="email" inputValue={email}>
					Email
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
					Hasło
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
					Potwierdź hasło
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
