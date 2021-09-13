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
const TravellingFee = lazy(() => import('./steps/TravellingFee'))

const BILLING_TYPES = require('../../helpers/data/billing_types.json')
const MAX_TRAVEL_DISTANCES = require('../../helpers/data/max_travel_distances.json')
const STEPS_AMOUNT = 10

function RegisterForm({ closeModal, register }) {
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

			billing_type,
			travel_fee,
			max_travel_distance,
			travel_fee_rules,
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
		work_remotely: true, // false

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

		billing_type: BILLING_TYPES[0],
		travel_fee: 0,
		max_travel_distance: MAX_TRAVEL_DISTANCES[3],
		travel_fee_rules: '',
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

	const nextStep = () => {
		let num = 1

		if (step === 7 && !work_remotely) num = 2
		setStep((prevStep) => prevStep + num)
	}

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
						step > 1
							? setStep((prevStep) => prevStep - 1)
							: closeModal()
					}
				>
					<HiOutlineArrowLeft size="25" />
				</Button>
				<Button rounded onClick={() => setStep(6)}>
					Go to 6
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
									setData={(data) =>
										setData((prevData) => ({
											...prevData,
											...data,
										}))
									}
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
								<WorkType
									work_stationary={work_stationary}
									work_remotely={work_remotely}
									onChange={onChange}
								/>
							) : step === 6 ? (
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
									setData={(data) =>
										setData((prevData) => ({
											...prevData,
											...data,
										}))
									}
								/>
							) : step === 7 ? (
								<FindAddress
									city={city.placeName}
									address={address}
									postal_code={postal_code}
									latitude={latitude}
									longitude={longitude}
									setData={(data) =>
										setData((prevData) => ({
											...prevData,
											...data,
										}))
									}
								/>
							) : step === 8 ? (
								<TravellingFee
									onChange={onChange}
									setData={(data) =>
										setData((prevData) => ({
											...prevData,
											...data,
										}))
									}
									billing_type={billing_type}
									travel_fee={travel_fee}
									max_travel_distance={max_travel_distance}
									travel_fee_rules={travel_fee_rules}
									latitude={latitude}
									longitude={longitude}
								/>
							) : step === 9 ? (
								<SetWorkingHours
									onChangeIsWorkingDay={onChangeIsWorkingDay}
									setData={(data) =>
										setData((prevData) => ({
											...prevData,
											...data,
										}))
									}
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
									onClick={nextStep}
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
	closeModal: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
	// register,
}

export default connect(null, mapDispatchToProps)(RegisterForm)
