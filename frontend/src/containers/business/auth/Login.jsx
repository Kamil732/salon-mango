import React, { lazy, Suspense, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../../../assets/css/pageHero.css'

import { login } from '../../../redux/actions/auth'
import { baseUrl } from '../../../app/location-params'

import { ReactComponent as AuthIllustration } from '../../../assets/svgs/auth-illustration.svg'

import CSRFToken from '../../../components/CSRFToken'
import Card from '../../../layout/Card'
import { FormControl } from '../../../layout/forms/Forms'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'
import Button from '../../../layout/buttons/Button'
import { Link, Redirect } from 'react-router-dom'
import Modal from '../../../layout/Modal'
import ErrorBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'

const RegisterForm = lazy(() => import('./RegisterForm'))

function Login({ isAuthenticated, login }) {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const [{ email, password }, setData] = useState({
		email: '',
		password: '',
	})
	const [isRegisterForm, setIsRegisterForm] = useState(false)

	const onChange = (e) =>
		setData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))

	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)
		await login('xd', email, password)
		setLoading(false)
	}

	if (isAuthenticated && !loading)
		return (
			<Redirect
				to={baseUrl + process.env.REACT_APP_BUSINESS_PANEL_CALENDAR_URL}
			/>
		)

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
						<Trans i18nKey="auth.no_account">
							You don't have an account yet? Click{' '}
							<Button
								link
								className="slide-floor"
								onClick={() => setIsRegisterForm(true)}
							>
								here
							</Button>{' '}
							to create one
						</Trans>
					</p>
				</div>

				<div className="page-hero__content">
					<div className="page-hero__title">{t('auth.sign_in')}</div>

					<Card>
						<Card.Body>
							<form onSubmit={onSubmit}>
								<CSRFToken />

								<FormControl>
									<Label htmlFor="email" inputValue={email}>
										{t('auth.email')}
									</Label>
									<Input
										required
										type="email"
										id="email"
										name="email"
										onChange={onChange}
										value={email}
									/>
								</FormControl>
								<FormControl>
									<Label
										htmlFor="password"
										inputValue={password}
									>
										{t('auth.password')}
									</Label>
									<Input
										required
										type="password"
										id="password"
										name="password"
										onChange={onChange}
										value={password}
										min="3"
									/>
								</FormControl>

								<div className="space-between wrap-vertical">
									<Button
										primary
										loading={loading}
										loadingText={t('auth.logging_in')}
									>
										{t('auth.sign_in')}
									</Button>
									<Link to="/" className="slide-floor">
										{t('auth.forgot_password')}
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
