import React, { lazy, Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

// import { register } from '../../redux/actions/auth'
import { HiOutlineArrowLeft } from 'react-icons/hi'

import CSRFToken from '../../components/CSRFToken'
import Card from '../../layout/cards/Card'
import ErrorBoundary from '../../components/ErrorBoundary'
import CircleLoader from '../../layout/loaders/CircleLoader'
import Button from '../../layout/buttons/Button'

const SalonInformation = lazy(() => import('./forms/SalonInformation'))
const Credentials = lazy(() => import('./forms/Credentials'))
const AcceptTerms = lazy(() => import('./forms/AcceptTerms'))
const ChooseCategories = lazy(() => import('./forms/ChooseCategories'))
const SetWorkingHours = lazy(() => import('./forms/SetWorkingHours'))
const WorkType = lazy(() => import('./forms/WorkType'))
const FindAddress = lazy(() => import('./forms/FindAddress'))

const STEPS_AMOUNT = 10

function RegisterForm({ isAuthenticated, register }) {
	const [loading, setLoading] = useState(false)
	const [
		{
			email,
			password,
			confirm_password,
			salon_name,
			first_name,
			last_name,
			phone_prefix,
			phone_number,
			recomendation_code,
			accept_terms,
			categories,
			end_work_sunday,
			start_work_sunday,
			end_work_saturday,
			start_work_saturday,
			end_work_friday,
			start_work_friday,
			end_work_thursday,
			start_work_thursday,
			end_work_wednesday,
			start_work_wednesday,
			end_work_tuesday,
			start_work_tuesday,
			end_work_monday,
			start_work_monday,
			address,
		},
		setData,
	] = useState({
		email: '',
		password: '',
		confirm_password: '',
		salon_name: '',
		first_name: '',
		last_name: '',
		phone_prefix: '',
		phone_number: '',
		recomendation_code: '',
		accept_terms: false,
		categories: {
			barber_shop: {
				name: 'Barber shop',
				checked: false,
			},
			eyebrows_eyelashes: {
				name: 'Brwi i rzęsy',
				checked: false,
			},
			depilation: {
				name: 'Depilacja',
				checked: false,
			},
			dietician: {
				name: 'Dietetyk',
				checked: false,
			},
			physiotherapy: {
				name: 'Fizjoterapia',
				checked: false,
			},
			hairdresser: {
				name: 'Fryzjer',
				checked: false,
			},
			makeup: {
				name: 'Makijaż',
				checked: false,
			},
			wedding_makeup: {
				name: 'Makijaż ślubny',
				checked: false,
			},
			massage: {
				name: 'Masaż',
				checked: false,
			},
			aesthetic_medicine: {
				name: 'Medycyna Estetyczna',
				checked: false,
			},
			natural_medicine: {
				name: 'Medycyna Naturalna',
				checked: false,
			},
			nails: {
				name: 'Paznokcie',
				checked: false,
			},
			piercing: {
				name: 'Piercing',
				checked: false,
			},
			podiatry: {
				name: 'Podologia',
				checked: false,
			},
			psychotherapy: {
				name: 'Psychoterapia',
				checked: false,
			},
			beauty_studio: {
				name: 'Salon Kosmetyczny',
				checked: false,
			},
			dentist: {
				name: 'Stomatolog',
				checked: false,
			},
			tattoo_studio: {
				name: 'Studio tatuażu',
				checked: false,
			},
			personal_trainer: {
				name: 'Trener Personalny',
				checked: false,
			},
			health: {
				name: 'Zdrowie',
				checked: false,
			},
			other: {
				name: 'Inne',
				checked: false,
			},
		},
		end_work_sunday: null,
		start_work_sunday: null,
		end_work_saturday: null,
		start_work_saturday: null,
		end_work_friday: '19:00',
		start_work_friday: '10:00',
		end_work_thursday: '19:00',
		start_work_thursday: '10:00',
		end_work_wednesday: '19:00',
		start_work_wednesday: '10:00',
		end_work_tuesday: '19:00',
		start_work_tuesday: '10:00',
		end_work_monday: '19:00',
		start_work_monday: '10:00',
		working_type: null,
		address: '',
	})
	const [step, setStep] = useState(1)

	if (isAuthenticated)
		return <Redirect to={process.env.REACT_APP_PANEL_URL} />

	// useEffect(() => {}, [address])

	const onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		setData((prevData) => ({
			...prevData,
			[e.target.name]: value,
		}))
	}

	const onChangeCategory = (e) =>
		setData((prevData) => ({
			...prevData,
			categories: {
				...prevData.categories,
				[e.target.name]: {
					...prevData.categories[e.target.name],
					checked: e.target.checked,
				},
			},
		}))

	const onChangeIsWorkingDay = (e) =>
		setData((prevData) => ({
			...prevData,
			[`start_work_${e.target.name}`]: e.target.checked ? '10:00' : null,
			[`end_work_${e.target.name}`]: e.target.checked ? '19:00' : null,
		}))

	const chooseWorkingType = (type) => {
		setData((prevData) => ({
			...prevData,
			working_type: type,
		}))
		setStep((prevStep) => prevStep + 1)
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)
		// await register('xd', email, password)
		setLoading(false)
	}

	const loader = (
		<div className="center-container">
			<CircleLoader />
		</div>
	)

	return (
		<Card formCard className="center-item">
			<Card.Title>
				<Button
					rounded
					onClick={() =>
						step > 1 ? setStep((prevStep) => prevStep - 1) : null
					}
				>
					<HiOutlineArrowLeft size="25" />
				</Button>
			</Card.Title>
			<Card.Body>
				<form onSubmit={onSubmit}>
					<CSRFToken />

					<ErrorBoundary>
						<Suspense fallback={loader}>
							{step === 1 ? (
								<SalonInformation
									onChange={onChange}
									salon_name={salon_name}
									first_name={first_name}
									last_name={last_name}
									phone_number={phone_number}
								/>
							) : step === 2 ? (
								<Credentials
									onChange={onChange}
									email={email}
									password={password}
									confirm_password={confirm_password}
								/>
							) : step === 3 ? (
								<AcceptTerms
									onChange={onChange}
									accept_terms={accept_terms}
								/>
							) : step === 4 ? (
								<ChooseCategories
									onChangeCategory={onChangeCategory}
									categories={categories}
								/>
							) : step === 5 ? (
								<SetWorkingHours
									onChangeIsWorkingDay={onChangeIsWorkingDay}
									start_work_monday={start_work_monday}
									end_work_monday={end_work_monday}
									start_work_tuesday={start_work_tuesday}
									end_work_tuesday={end_work_tuesday}
									start_work_wednesday={start_work_wednesday}
									end_work_wednesday={end_work_wednesday}
									start_work_thursday={start_work_thursday}
									end_work_thursday={end_work_thursday}
									start_work_friday={start_work_friday}
									end_work_friday={end_work_friday}
									start_work_saturday={start_work_saturday}
									end_work_saturday={end_work_saturday}
									start_work_sunday={start_work_sunday}
									end_work_sunday={end_work_sunday}
								/>
							) : step === 6 ? (
								<WorkType
									chooseWorkingType={chooseWorkingType}
								/>
							) : step === 7 ? (
								<FindAddress
									onChange={onChange}
									address={address}
								/>
							) : step === 8 ? (
								<></>
							) : step === 9 ? (
								<></>
							) : step === 10 ? (
								<></>
							) : null}

							{step === STEPS_AMOUNT ? (
								<Button
									success
									loading={loading}
									loadingText="Zapisywanie danych"
									type="submit"
									style={{ width: '100%' }}
								>
									Zakończ
								</Button>
							) : step !== 6 ? (
								<Button
									primary
									onClick={() =>
										setStep((prevStep) => prevStep + 1)
									}
									type="button"
									style={{ width: '100%' }}
								>
									Dalej
								</Button>
							) : null}
						</Suspense>
					</ErrorBoundary>
				</form>
			</Card.Body>
		</Card>
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
