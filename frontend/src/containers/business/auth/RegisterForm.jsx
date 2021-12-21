import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18next from 'i18next'
import '../../../assets/css/progressbar.css'

import axios from 'axios'
import getHeaders from '../../../helpers/getHeaders'
import { register } from '../../../redux/actions/auth'
import { getOrCreateBusinessData } from '../../../redux/actions/data'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import { useTranslation } from 'react-i18next'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { PRICE_TYPES, TRAVEL_MAX_DISTANCES } from '../../../helpers/consts'
import { COUNTRIES_DATA } from '../../../app/locale/consts'
import { country } from '../../../app/locale/location-params'

import Card from '../../../layout/Card'
import ErrorBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import Button from '../../../layout/buttons/Button'

const EmailCheck = lazy(() => import('./steps/EmailCheck'))
const BusinessData = lazy(() => import('./steps/BusinessData'))
const Credentials = lazy(() => import('./steps/Credentials'))
const AcceptTerms = lazy(() => import('./steps/AcceptTerms'))
const ChooseCategories = lazy(() => import('./steps/ChooseCategories'))
const SetOpenHours = lazy(() => import('./steps/SetOpenHours'))
const WorkType = lazy(() => import('./steps/WorkType'))
const FindAddress = lazy(() => import('./steps/FindAddress'))
const SetAddress = lazy(() => import('./steps/SetAddress'))
const TravellingFee = lazy(() => import('./steps/TravellingFee'))
const AddServices = lazy(() => import('./steps/AddServices'))
const AddEmployees = lazy(() => import('./steps/AddEmployees'))

const countries = require('../../../assets/data/countries.json')

const INITIAL_STEPS_DATA = [
	{
		component: (props) => (
			<EmailCheck
				email={props.email}
				onChange={props.onChange}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				errors={props.errors}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: true,
		validateStep: async ({ email }, { setErrors }) => {
			setErrors({})

			try {
				await axios.get(
					`${process.env.REACT_APP_API_URL}/accounts/exists/?email=${email}`,
					getHeaders()
				)

				return true
			} catch (err) {
				if (err.response) setErrors(err.response.data)
				else
					NotificationManager.error(
						i18next.t('error.description', { ns: 'common' }),
						i18next.t('error.title', { ns: 'common' })
					)

				return false
			}
		},
	},
	{
		component: (props) => (
			<BusinessData
				onChange={props.onChange}
				updateData={props.updateData}
				business_name={props.business_name}
				name={props.name}
				phone_prefix={props.phone_prefix}
				phone_number={props.phone_number}
				recomendation_code={props.recomendation_code}
				errors={props.errors}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: true,
		validateStep: async (
			{ phone_prefix: { dialCode: phone_prefix }, phone_number },
			{ setErrors, updateData }
		) => {
			setErrors({})

			try {
				const body = JSON.stringify({
					phone_number: phone_prefix + phone_number,
				})

				const res = await axios.post(
					`${process.env.REACT_APP_API_URL}/utils/validate_phone/`,
					body,
					getHeaders(true)
				)

				updateData({
					phone_number: res.data.phone_number.replace(
						phone_prefix,
						''
					),
				})
				return true
			} catch (err) {
				if (err.response) setErrors(err.response.data)
				else
					NotificationManager.error(
						i18next.t('error.description', { ns: 'common' }),
						i18next.t('error.title', { ns: 'common' })
					)

				return false
			}
		},
	},
	{
		component: (props) => (
			<Credentials
				onChange={props.onChange}
				password={props.password}
				confirm_password={props.confirm_password}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				errors={props.errors}
			/>
		),
		validateStep: ({ password, confirm_password }, { setErrors }) => {
			if (confirm_password === password) return true

			setErrors({
				password: [
					i18next.t('error.not_match', {
						ns: 'common',
						item: i18next.t('password_plural', { ns: 'auth' }),
					}),
				],
				confirm_password: [
					i18next.t('error.not_match', {
						ns: 'common',
						item: i18next.t('password_plural', { ns: 'auth' }),
					}),
				],
			})
			return false
		},
		nextBtnDisabled: true,
	},
	{
		component: (props) => (
			<AcceptTerms
				onChange={props.onChange}
				accept_terms={props.accept_terms}
				changeComponentData={props.changeComponentData}
				setErrors={props.setErrors}
			/>
		),
		skip: !COUNTRIES_DATA[country].gdpr,
		nextBtnDisabled: true,
		noForm: true,
	},
	{
		component: (props) => (
			<ChooseCategories
				onChangeCategory={props.onChangeCategory}
				categories={props.categories}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: true,
		noForm: true,
	},
	{
		component: (props) => (
			<WorkType
				work_stationary={props.work_stationary}
				work_remotely={props.work_remotely}
				onChange={props.onChange}
				componentData={props.componentData}
				changeComponentData={props.changeComponentData}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: false,
		noForm: true,
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
				setErrors={props.setErrors}
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
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: false,
	},
	{
		component: (props) => (
			<TravellingFee
				onChange={props.onChange}
				updateData={props.updateData}
				travel_billing_type={props.travel_billing_type}
				travel_fee={props.travel_fee}
				travel_max_distance={props.travel_max_distance}
				travel_fee_rules={props.travel_fee_rules}
				latitude={props.latitude}
				longitude={props.longitude}
				setErrors={props.setErrors}
			/>
		),
		skip: true,
		nextBtnDisabled: false,
	},
	{
		component: (props) => (
			<SetOpenHours
				onChangeIsWorkingDay={props.onChangeIsWorkingDay}
				setData={props.setData}
				open_hours={props.open_hours}
				blocked_hours={props.blocked_hours}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: false,
		noForm: true,
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
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: false,
		loaded: false,
		noForm: true,
	},
	{
		component: (props) => (
			<AddEmployees
				employees={props.employees}
				name={props.name}
				phone_prefix={props.phone_prefix}
				setData={props.setData}
				setErrors={props.setErrors}
			/>
		),
		nextBtnDisabled: false,
		noForm: true,
		validateStep: async (
			{
				accept_terms,
				email,
				password,
				business_name,
				name,
				phone_prefix: { dialCode: phone_prefix },
				phone_number,
				recomendation_code,
				city,
				travel_billing_type,
				travel_max_distance,
				services,
				employees,
				...data
			},
			{ setErrors, register, getOrCreateBusinessData }
		) => {
			if (!accept_terms)
				NotificationManager.error(
					i18next.t('error.description', { ns: 'common' }),
					i18next.t('error.title', { ns: 'common' })
				)

			setErrors({})

			try {
				await register(email, password)

				const business_body = JSON.stringify({
					...data,
					name: business_name,
					calling_code: phone_prefix,
					phone_number: phone_prefix + phone_number,
					city: city.placeName,
					travel_billing_type: travel_billing_type.value,
					travel_max_distance: parseInt(
						travel_max_distance.label.slice(0, 2)
					),

					services: services.map(({ id, ...service }) => ({
						...service,
						price_type: service.price_type.value,
					})),
					employees: [
						{
							name,
							email,
							phone_number: phone_prefix + phone_number,
							position: i18next.t('add_employees.owner', {
								ns: 'business_register',
							}),
						},
						...employees.map((employee) => ({
							...employee,
							phone_number:
								employee.phone_prefix.dialCode +
								employee.phone_number,
						})),
					],
				})

				await getOrCreateBusinessData(business_body, true)

				return true
			} catch (err) {
				if (err.response) setErrors(err.response.data)
				else
					NotificationManager.error(
						i18next.t('error.description', { ns: 'common' }),
						i18next.t('error.title', { ns: 'common' })
					)

				return false
			}
		},
	},
]

function RegisterForm({ closeModal, register, getOrCreateBusinessData }) {
	const { t } = useTranslation('common')
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [data, setData] = useState({
		email: '',
		password: '',
		confirm_password: '',
		business_name: '',
		name: '',
		phone_prefix: countries.find(
			({ isoCode }) => isoCode.toLowerCase() === country
		),
		phone_number: '',
		recomendation_code: '',
		accept_terms: false,
		categories: [],
		open_hours: [
			{
				weekday: 1,
				start: '09:00',
				end: '17:00',
			},
			{
				weekday: 2,
				start: '09:00',
				end: '17:00',
			},
			{
				weekday: 3,
				start: '09:00',
				end: '17:00',
			},
			{
				weekday: 4,
				start: '09:00',
				end: '17:00',
			},
			{
				weekday: 5,
				start: '09:00',
				end: '17:00',
			},
		],
		blocked_hours: [],

		work_stationary: true,
		work_remotely: false,

		country,
		address: '',
		premises_number: '',
		city: {},
		postal_code: '',
		share_premises: false,
		common_premises_name: '',
		common_premises_number: '',
		latitude: null,
		longitude: null,

		travel_billing_type: PRICE_TYPES.FREE,
		travel_fee: 0,
		travel_max_distance: TRAVEL_MAX_DISTANCES[3],
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

	useEffect(() => {
		setErrors({})
	}, [step])

	const changeStep = (previous = false) => {
		let step = previous ? -1 : 1
		let shouldCloseModal = false

		setStep((prevStep) => {
			// change step to the closest that should NOT be skipped
			for (let i = 0; i < STEPS.length; i++) {
				i = previous ? -i : i

				if (prevStep + step + i < 0) {
					shouldCloseModal = true
					return 0
				}
				if (!STEPS[prevStep + step + i].skip) {
					step += i
					break
				}
			}

			return prevStep + step
		})

		setTimeout(() => {
			if (shouldCloseModal) closeModal()
		}, 0)
	}

	const onSubmit = async (e) => {
		e.preventDefault()

		const currentStep = STEPS[step]
		if (!('validateStep' in currentStep)) {
			changeStep()
			return
		}

		try {
			setLoading(true)

			if (
				await currentStep.validateStep(data, {
					setErrors,
					updateData,
					register,
					getOrCreateBusinessData,
				})
			)
				changeStep()
		} catch (err) {
			console.log(err)
		} finally {
			setLoading(false)
		}
	}

	const onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		setData((prevData) => ({
			...prevData,
			[e.target.name]: value,
		}))

		if (e.target.name in errors)
			setErrors((prevErrors) => ({
				...prevErrors,
				[e.target.name]: undefined,
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

	const loader = (
		<div className="center-container">
			<CircleLoader />
		</div>
	)

	const content = (
		<>
			<ErrorBoundary>
				<Suspense fallback={loader}>
					{STEPS[step].component({
						...data,
						componentData: STEPS[step],
						changeComponentData,
						errors,
						setErrors,
						updateData,
						setData,
						onChange,
						onChangeCategory,
					})}
				</Suspense>
			</ErrorBoundary>

			<Button
				primary
				type="submit"
				onClick={STEPS[step].noForm ? onSubmit : undefined}
				className="form-card__btn"
				loading={loading}
				disabled={STEPS[step].nextBtnDisabled}
			>
				{t('actions.next')}
			</Button>
		</>
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
				{STEPS[step].noForm ? (
					content
				) : (
					<form onSubmit={onSubmit}>{content}</form>
				)}
			</Card.Body>
		</Card>
	)
}

RegisterForm.prototype.propTypes = {
	closeModal: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	getOrCreateBusinessData: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
	register,
	getOrCreateBusinessData,
}

export default connect(null, mapDispatchToProps)(RegisterForm)
