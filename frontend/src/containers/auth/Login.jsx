import React, { lazy, Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { login } from '../../redux/actions/auth'

import { ReactComponent as AuthIllustration } from '../../assets/svgs/auth-illustration.svg'

import CSRFToken from '../../components/CSRFToken'
import Card from '../../layout/cards/Card'
import FormControl from '../../layout/forms/FormControl'
import Button from '../../layout/buttons/Button'
import { Link, Redirect } from 'react-router-dom'
import Modal from '../../layout/Modal'
import ErrorBoundary from '../../components/ErrorBoundary'
import CircleLoader from '../../layout/loaders/CircleLoader'

const RegisterForm = lazy(() => import('./RegisterForm'))

function Login({ isAuthenticated, login }) {
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isRegisterForm, setIsRegisterForm] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)
		await login('xd', email, password)
		setLoading(false)
	}

	if (isAuthenticated)
		return <Redirect to={process.env.REACT_APP_PANEL_URL} />

	return (
		<>
			{isRegisterForm && (
				<Modal closeModal={() => setIsRegisterForm(false)} fullscreen>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense
								fallback={
									<div className="center-container">
										<CircleLoader />
									</div>
								}
							>
								<RegisterForm
									closeModal={() => setIsRegisterForm(false)}
								/>
							</Suspense>
						</ErrorBoundary>
					</Modal.Body>
				</Modal>
			)}

			<div className="page-hero">
				<div className="page-hero__img-container">
					<AuthIllustration className="page-hero__img" />
					<p className="text-broken">
						Nie masz jeszcze konta? Kliknij{' '}
						<Button
							link
							className="slide-floor"
							onClick={() => setIsRegisterForm(true)}
						>
							tutaj
						</Button>{' '}
						by je utworzyć
					</p>
				</div>

				<div className="page-hero__content">
					<div className="page-hero__title">Zaloguj się</div>

					<Card>
						<Card.Body>
							<form onSubmit={onSubmit}>
								<CSRFToken />

								<FormControl>
									<FormControl.Label
										htmlFor="email"
										inputValue={email}
									>
										Email
									</FormControl.Label>
									<FormControl.Input
										required
										type="email"
										id="email"
										name="email"
										onChange={(e) =>
											setEmail(e.target.value)
										}
										value={email}
									/>
								</FormControl>
								<FormControl>
									<FormControl.Label
										htmlFor="password"
										inputValue={password}
									>
										Hasło
									</FormControl.Label>
									<FormControl.Input
										required
										type="password"
										id="password"
										name="password"
										onChange={(e) =>
											setPassword(e.target.value)
										}
										value={password}
										min="3"
									/>
								</FormControl>

								<div className="space-between wrap-vertical">
									<Button
										primary
										loading={loading}
										loadingText="Logowanie"
									>
										Zaloguj się
									</Button>
									<Link to="/" className="slide-floor">
										Nie pamiętasz hasła?
									</Link>
								</div>
							</form>
						</Card.Body>
					</Card>
				</div>
			</div>
		</>
	)
}

Login.prototype.propTypes = {
	isAuthenticated: PropTypes.bool,
	login: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = {
	login,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
