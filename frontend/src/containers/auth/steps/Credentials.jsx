import React from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../layout/forms/Forms'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'

function Credentials({ onChange, email, password, confirm_password }) {
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
}

export default Credentials
