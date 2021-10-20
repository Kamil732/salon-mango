import React, { lazy, Suspense, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../../../assets/css/progressbar.css'

// import { register } from '../../redux/actions/auth'
import { HiOutlineArrowLeft } from 'react-icons/hi'

import Card from '../../../layout/Card'
import ErrorBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import Button from '../../../layout/buttons/Button'
import { useTranslation } from 'react-i18next'

const SalonData = lazy(() => import('./steps/SalonData'))
const Credentials = lazy(() => import('./steps/Credentials'))
const AcceptTerms = lazy(() => import('./steps/AcceptTerms'))
const ChooseCategories = lazy(() => import('./steps/ChooseCategories'))
const SetWorkingHours = lazy(() => import('./steps/SetWorkingHours'))
const WorkType = lazy(() => import('./steps/WorkType'))
const FindAddress = lazy(() => import('./steps/FindAddress'))
const SetAddress = lazy(() => import('./steps/SetAddress'))
const TravellingFee = lazy(() => import('./steps/TravellingFee'))
const AddServices = lazy(() => import('./steps/AddServices'))
const AddEmployees = lazy(() => import('./steps/AddEmployees'))

const BILLING_TYPES = require('../../../assets/data/billing_types.json')
const MAX_TRAVEL_DISTANCES = require('../../../assets/data/max_travel_distances.json')
const INITIAL_STEPS_DATA = [
	{
		component: (props) => (
			<SalonData
				onChange={props.onChange}
				updateData={props.updateData}
				salon_name={props.salon_name}
				name={props.name}
				phone_prefix={props.phone_prefix}
				phone_number={props.phone_number}
				recomendation_code={props.recomendation_code}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: true,
		validateStep: (data) => {},
	},
	{
		component: (props) => (
			<Credentials
				onChange={props.onChange}
				email={props.email}
				password={props.password}
				confirm_password={props.confirm_password}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: true,
	},
	{
		component: (props) => (
			<AcceptTerms
				onChange={props.onChange}
				accept_terms={props.accept_terms}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: true,
	},
	{
		component: (props) => (
			<ChooseCategories
				onChangeCategory={props.onChangeCategory}
				categories={props.categories}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: true,
	},
	{
		component: (props) => (
			<WorkType
				work_stationary={props.work_stationary}
				work_remotely={props.work_remotely}
				onChange={props.onChange}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: false,
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
				updateData={props.updateData}
				setData={props.setData}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
			/>
		),
		nextBtnDisabled: true,
	},
	{
		component: (props) => (
			<FindAddress
				city={props.city.placeName}
				address={props.address}
				postal_code={props.postal_code}
				latitude={props.latitude}
				longitude={props.longitude}
				updateData={props.updateData}
			/>
		),
		nextBtnDisabled: false,
	},
	{
		component: (props) => (
			<TravellingFee
				onChange={props.onChange}
				updateData={props.updateData}
				billing_type={props.billing_type}
				travel_fee={props.travel_fee}
				max_travel_distance={props.max_travel_distance}
				travel_fee_rules={props.travel_fee_rules}
				latitude={props.latitude}
				longitude={props.longitude}
			/>
		),
		skip: false,
		nextBtnDisabled: false,
	},
	{
		component: (props) => (
			<SetWorkingHours
				onChangeIsWorkingDay={props.onChangeIsWorkingDay}
				updateData={props.updateData}
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
		nextBtnDisabled: false,
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
		nextBtnDisabled: false,
		loaded: false,
	},
	{
		component: (props) => (
			<AddEmployees
				employees={props.employees}
				name={props.name}
				phone_prefix={props.phone_prefix}
				setData={props.setData}
			/>
		),
		nextBtnDisabled: false,
	},
]

function RegisterForm({ closeModal, register }) {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({
		email: '',
		password: '',
		confirm_password: '',
		salon_name: '',
		name: '',
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
		work_remotely: false,

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
		employees: [],
	})
	const [step, setStep] = useState(0)
	const [STEPS, setSTEPS] = useState([...INITIAL_STEPS_DATA])

	const updateData = useCallback(
		(data) =>
			setData((prevData) => ({
				...prevData,
				...data,
			})),
		[]
	)

	const changeComponentData = useCallback(
		(newData, stepIdx = step) =>
			setSTEPS((prevSTEPS) =>
				prevSTEPS.map((stepData, idx) =>
					idx === stepIdx
						? {
								...stepData,
								...newData,
						  }
						: stepData
				)
			),
		[step]
	)

	const changeStep = (previous = false) => {
		let step = previous ? -1 : 1

		setStep((prevStep) => {
			if (prevStep + step < 0) closeModal()

			// change step to the closest that should NOT be skipped
			for (let i = 0; i < STEPS.length; i++) {
				i = previous ? -i : i
				if (prevStep + step + i > STEPS.length - 1) return 0
				if (!STEPS[prevStep + step + i].skip) {
					step += i
					break
				}
			}

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

	const loader = (
		<div className="center-container">
			<CircleLoader />
		</div>
	)

	return (
		<Card formCard className="center-item">
			<Card.Header>
				<div className="space-between">
					<Button rounded onClick={() => changeStep(true)}>
						<HiOutlineArrowLeft size="25" />
					</Button>
					<div className="progressbar">
						<span
							style={{ width: `${(step / STEPS.length) * 100}%` }}
						></span>
					</div>
				</div>
			</Card.Header>
			<Card.Body>
				<ErrorBoundary>
					<Suspense fallback={loader}>
						{STEPS[step].component({
							...data,
							componentData: STEPS[step],
							changeComponentData,
							updateData,
							setData,
							onChange,
							onChangeCategory,
							onChangeIsWorkingDay,
						})}
					</Suspense>
				</ErrorBoundary>

				<Button
					primary
					onClick={async () => {
						const currentStep = STEPS[step]
						if (!('validateStep' in currentStep)) {
							changeStep()
							return
						}

						try {
							setLoading(true)
							await currentStep.validateStep(data)
							changeStep()
						} catch (err) {
							console.log(err)
						} finally {
							setLoading(false)
						}
					}}
					type="button"
					className="form-card__btn"
					disabled={STEPS[step].nextBtnDisabled}
				>
					{t('actions.next')}
				</Button>
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
