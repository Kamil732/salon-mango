import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import nextId from 'react-id-generator'

// import { register } from '../../redux/actions/auth'
import { HiOutlineArrowLeft } from 'react-icons/hi'

import CSRFToken from '../../components/CSRFToken'
import Card from '../../layout/Card'
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
const AddServices = lazy(() => import('./steps/AddServices'))

const BILLING_TYPES = require('../../helpers/data/billing_types.json')
const MAX_TRAVEL_DISTANCES = require('../../helpers/data/max_travel_distances.json')
const INITIAL_STEPS_DATA = [
	{
		component: (props) => (
			<SalonInformation
				onChange={props.onChange}
				setData={(data) =>
					props.setData((prevData) => ({
						...prevData,
						...data,
					}))
				}
				salon_name={props.salon_name}
				first_name={props.first_name}
				last_name={props.last_name}
				phone_prefix={props.phone_prefix}
				phone_number={props.phone_number}
				recomendation_code={props.recomendation_code}
			/>
		),
	},
	{
		component: (props) => (
			<Credentials
				onChange={props.onChange}
				email={props.email}
				password={props.password}
				confirm_password={props.confirm_password}
			/>
		),
	},
	{
		component: (props) => (
			<AcceptTerms
				onChange={props.onChange}
				accept_terms={props.accept_terms}
			/>
		),
	},
	{
		component: (props) => (
			<ChooseCategories
				onChangeCategory={props.onChangeCategory}
				categories={props.categories}
			/>
		),
	},
	{
		component: (props) => (
			<WorkType
				work_stationary={props.work_stationary}
				work_remotely={props.work_remotely}
				onChange={props.onChange}
			/>
		),
	},
	{
		component: (props) => (
			<SetAddress
				country={props.country}
				address={props.address}
				premises_number={props.premises_number}
				city={props.city}
				postal_code={props.postal_code}
				share_premises={props.share_premises}
				common_premises_name={props.common_premises_name}
				common_premises_number={props.common_premises_number}
				onChange={props.onChange}
				setData={(data) =>
					props.setData((prevData) => ({
						...prevData,
						...data,
					}))
				}
			/>
		),
	},
	{
		component: (props) => (
			<FindAddress
				city={props.city.placeName}
				address={props.address}
				postal_code={props.postal_code}
				latitude={props.latitude}
				longitude={props.longitude}
				setData={(data) =>
					props.setData((prevData) => ({
						...prevData,
						...data,
					}))
				}
			/>
		),
	},
	{
		component: (props) => (
			<TravellingFee
				onChange={props.onChange}
				setData={(data) =>
					props.setData((prevData) => ({
						...prevData,
						...data,
					}))
				}
				billing_type={props.billing_type}
				travel_fee={props.travel_fee}
				max_travel_distance={props.max_travel_distance}
				travel_fee_rules={props.travel_fee_rules}
				latitude={props.latitude}
				longitude={props.longitude}
			/>
		),
	},
	{
		component: (props) => (
			<SetWorkingHours
				onChangeIsWorkingDay={props.onChangeIsWorkingDay}
				setData={(data) =>
					props.setData((prevData) => ({
						...prevData,
						...data,
					}))
				}
				start_work_monday={props.start_work_monday}
				end_work_monday={props.end_work_monday}
				start_work_tuesday={props.start_work_tuesday}
				end_work_tuesday={props.end_work_tuesday}
				start_work_wednesday={props.start_work_wednesday}
				end_work_wednesday={props.end_work_wednesday}
				start_work_thursday={props.start_work_thursday}
				end_work_thursday={props.end_work_thursday}
				start_work_friday={props.start_work_friday}
				end_work_friday={props.end_work_friday}
				start_work_saturday={props.start_work_saturday}
				end_work_saturday={props.end_work_saturday}
				start_work_sunday={props.start_work_sunday}
				end_work_sunday={props.end_work_sunday}
			/>
		),
	},
	{
		component: (props) => (
			<AddServices
				services={props.services}
				work_remotely={props.work_remotely}
				categories={props.categories}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				setData={props.setData}
			/>
		),
		loaded: false,
	},
]

function RegisterForm({ closeModal, register }) {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({
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
		categories: [],
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
		city: {},
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

		services: [],
	})
	const [step, setStep] = useState(0)
	const STEPS = useRef([...INITIAL_STEPS_DATA])

	// Reset data
	useEffect(() => {
		return () => (STEPS.current = [...INITIAL_STEPS_DATA])
	}, [])

	const changeStep = (previous = false) => {
		const step = previous ? -1 : 1

		setStep((prevStep) => {
			if (prevStep + step < 0) closeModal()
			if (prevStep + step > STEPS.current.length - 1) return 0

			return prevStep + step
		})
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
			categories: data.categories.includes(e.target.name)
				? data.categories.filter(
						(category) => category !== e.target.name
				  )
				: [...data.categories, e.target.name],
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
			<Card.Header>
				<Button rounded onClick={() => changeStep(true)}>
					<HiOutlineArrowLeft size="25" />
				</Button>
				<Button rounded onClick={() => setStep(9)}>
					Go to 9
				</Button>
			</Card.Header>
			<Card.Body>
				<form onSubmit={onSubmit}>
					<CSRFToken />

					<ErrorBoundary>
						<Suspense fallback={loader}>
							{STEPS.current[step].component({
								...data,
								componentData: STEPS.current[step],
								changeComponentData: (newData) =>
									(STEPS.current[step] = {
										...STEPS.current[step],
										...newData,
									}),
								setData,
								onChange,
								onChangeCategory,
								onChangeIsWorkingDay,
							})}
						</Suspense>
					</ErrorBoundary>

					<Button
						primary
						onClick={() => changeStep()}
						type="button"
						className="form-card__btn"
					>
						Dalej
					</Button>
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
