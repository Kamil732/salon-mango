import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

// import { register } from '../../redux/actions/auth'

import CSRFToken from '../../components/CSRFToken'
import FormControl from '../../layout/forms/FormControl'
import Button from '../../layout/buttons/Button'

const STEPS_AMOUNT = 4

function RegisterForm({ isAuthenticated, register }) {
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [step, setStep] = useState(1)

	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)
		// await register('xd', email, password)
		setLoading(false)
	}

	if (isAuthenticated)
		return <Redirect to={process.env.REACT_APP_PANEL_URL} />

	return (
		<form onSubmit={onSubmit}>
			<CSRFToken />

			<FormControl>
				{step}
				<FormControl.Label htmlFor="email_register" inputValue={email}>
					Email
				</FormControl.Label>
				<FormControl.Input
					required
					type="email"
					id="email_register"
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
			</FormControl>
			<FormControl>
				<FormControl.Label htmlFor="password" inputValue={password}>
					Hasło
				</FormControl.Label>
				<FormControl.Input
					required
					type="password"
					id="password"
					name="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					min="3"
				/>
			</FormControl>

			<div className="space-between">
				<Button
					secondary
					onClick={() =>
						step > 1 ? setStep((prevStep) => prevStep - 1) : null
					}
					type="button"
				>
					Wstecz
				</Button>
				{step === STEPS_AMOUNT ? (
					<Button
						primary
						loading={loading}
						loadingText="Zapisywanie danych"
						type="submit"
					>
						Zarejestruj
					</Button>
				) : (
					<Button
						success
						onClick={() => setStep((prevStep) => prevStep + 1)}
						type="button"
					>
						Dalej
					</Button>
				)}
			</div>
		</form>
	)
}

RegisterForm.prototype.propTypes = {
	isAuthenticated: PropTypes.bool,
	register: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	// register,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
