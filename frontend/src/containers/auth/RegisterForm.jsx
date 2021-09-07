import React, { lazy, Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import { register } from '../../redux/actions/auth'
import { HiOutlineArrowLeft } from 'react-icons/hi'

import CSRFToken from '../../components/CSRFToken'
import Card from '../../layout/cards/Card'
import ErrorBoundary from '../../components/ErrorBoundary'
import CircleLoader from '../../layout/loaders/CircleLoader'
import Button from '../../layout/buttons/Button'

const SalonInformation = lazy(() => import('./steps/SalonInformation'))
const Credentials = lazy(() => import('./steps/Credentials'))
const AcceptTerms = lazy(() => import('./steps/AcceptTerms'))
const ChooseCategories = lazy(() => import('./steps/ChooseCategories'))
const SetWorkingHours = lazy(() => import('./steps/SetWorkingHours'))
const WorkType = lazy(() => import('./steps/WorkType'))
const FindAddress = lazy(() => import('./steps/FindAddress'))
const SetAddress = lazy(() => import('./steps/SetAddress'))

const STEPS_AMOUNT = 10

function RegisterForm({ register }) {
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

			work_stationary,
			work_remotely,

			country,
			address,
			premises_number,
			city,
			postal_code,
			share_premises,
			common_premises_name,
			common_premises_number,
			latitude,
			longitude,
		},
		setData,
	] = useState({
		email: '',
		password: '',
		confirm_password: '',
		salon_name: '',
		first_name: '',
		last_name: '',
		phone_prefix: {},
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

		work_stationary: true,
		work_remotely: false,

		country: 'PL',
		address: '',
		premises_number: '',
		city: null,
		postal_code: '',
		share_premises: '',
		common_premises_name: '',
		common_premises_number: '',
		latitude: null,
		longitude: null,
	})
	const [step, setStep] = useState(1)

	useEffect(
		() =>
			setData((prevData) => ({
				...prevData,
				city: null,
			})),
		[postal_code]
	)

	const onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		setData((prevData) => ({
			...prevData,
			[e.target.name]: value,
		}))
	}

	const onChangeByKey = (key, val) =>
		setData((prevData) => ({
			...prevData,
			[key]: val,
		}))

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
									onChangeByKey={onChangeByKey}
									salon_name={salon_name}
									first_name={first_name}
									last_name={last_name}
									phone_prefix={phone_prefix}
									phone_number={phone_number}
									recomendation_code={recomendation_code}
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
								<SetAddress
									country={country}
									address={address}
									premises_number={premises_number}
									city={city}
									postal_code={postal_code}
									share_premises={share_premises}
									common_premises_name={common_premises_name}
									common_premises_number={
										common_premises_number
									}
									onChange={onChange}
									onChangeByKey={onChangeByKey}
								/>
							) : step === 6 ? (
								<FindAddress
									city={city}
									latitude={latitude}
									longitude={longitude}
									onChangeByKey={onChangeByKey}
								/>
							) : step === 7 ? (
								<WorkType
									work_stationary={work_stationary}
									work_remotely={work_remotely}
									onChange={onChange}
								/>
							) : step === 8 ? (
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
							) : (
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
							)}
						</Suspense>
					</ErrorBoundary>
				</form>
			</Card.Body>
		</Card>
	)
}

RegisterForm.prototype.propTypes = {
	register: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
	// register,
}

export default connect(null, mapDispatchToProps)(RegisterForm)
