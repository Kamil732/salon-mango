import React, { Component, lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import setMeetingEndDate from '../../../helpers/setMeetingEndDate'
import { options } from '../tools/inputs/RepeatEventInput'

import CSRFToken from '../../CSRFToken'
import { FormControl, FormGroup } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'
import Label from '../../../layout/forms/inputs/Label'
import Textarea from '../../../layout/forms/inputs/Textarea'

import Button from '../../../layout/buttons/Button'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Modal from '../../../layout/Modal'
import ErrorBoundary from '../../ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const EmployeeInput = lazy(() => import('../tools/inputs/EmployeeInput'))
const ResourceInput = lazy(() => import('../tools/inputs/ResourceInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))
const EmployeeAndResourceInputs = lazy(() =>
	import('../tools/inputs/EmployeeAndResourceInputs')
)
const RepeatEventInput = lazy(() => import('../tools/inputs/RepeatEventInput'))

class AddMeetingAdminForm extends Component {
	static propTypes = {
		resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		isBlocked: PropTypes.bool,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		employees: PropTypes.array,
		resources: PropTypes.array,
		resourceMap: PropTypes.object,
		addMeeting: PropTypes.func.isRequired,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		// Get employee's id from resources
		const selectedResourceMap = props.resourceMap.isMany
			? props.resourceMap.data.find(({ id }) => id === props.resourceId)
			: props.resourceMap.selected

		this.state = {
			loading: false,
			isAddCustomerForm: false,
			showMoreOptions: false,
			blocked: props.isBlocked,

			repeatData: {
				repeatTimes: 1,
				unit: options[0],
				appearancesNum: 1,
				endDate: props.startDate,
			},
			employee: selectedResourceMap?.employeeId
				? props.employees.find(
						({ id }) => id === selectedResourceMap.employeeId
				  )
				: {},
			resource: selectedResourceMap?.resourceId
				? props.resources.find(
						({ id }) => id === selectedResourceMap.resourceId
				  )
				: {},
			customer: {},
			services: [],
			private_description: '',
			customer_description: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (prevState.blocked !== this.state.blocked && prevState.blocked)
			this.setState({ employee: {} })

		setMeetingEndDate(
			prevState,
			this.state,
			this.props.startDate,
			this.props.calendarStep,
			this.props.changeEndDate
		)
	}

	onSubmit = async (e) => {
		e.preventDefault()
		const {
			blocked,
			customer,
			employee,
			resource,
			services,
			private_description,
			customer_description,
		} = this.state

		const payload = blocked
			? {
					employee: employee?.id,
					resource: resource?.id,
					private_description,
			  }
			: {
					customer: customer.id,
					services: services.map((service) => ({
						id: service.value.id,
						employee: service.employee.id,
						resources: service.resources.map(
							(resource) => resource.id
						),
					})),
					private_description,
					customer_description,
			  }

		await this.props.addMeeting(payload, (state) =>
			this.setState({ loading: state })
		)
	}

	onChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value

		this.setState({ [e.target.name]: value })
	}

	render() {
		const { startDate } = this.props
		const {
			loading,
			isAddCustomerForm,
			showMoreOptions,
			blocked,
			repeatData,
			customer,
			employee,
			resource,
			services,
			private_description,
			customer_description,
		} = this.state

		const loader = (
			<div className="center-container">
				<CircleLoader />
			</div>
		)

		return (
			<>
				{isAddCustomerForm && (
					<Modal
						closeModal={() =>
							this.setState({ isAddCustomerForm: false })
						}
						isChild
						small
					>
						<Modal.Header>Dodaj nowego klienta</Modal.Header>
						<Modal.Body>
							<ErrorBoundary>
								<Suspense fallback={loader}>
									<AddCustomerForm
										setCustomer={(state) =>
											this.setState({
												customer: state,
												isAddCustomerForm: false,
											})
										}
									/>
								</Suspense>
							</ErrorBoundary>
						</Modal.Body>
					</Modal>
				)}

				<ErrorBoundary>
					<Suspense fallback={loader}>
						<form onSubmit={this.onSubmit}>
							<CSRFToken />

							{!this.props.isBlocked && (
								<>
									<CheckBox.Label>
										Blokada
										<CheckBox
											name="blocked"
											checked={blocked}
											onChange={this.onChange}
										/>
									</CheckBox.Label>

									<div
										style={{
											display: blocked ? 'none' : 'block',
										}}
									>
										{showMoreOptions && (
											<RepeatEventInput
												value={repeatData}
												updateValue={(name, value) =>
													this.setState({
														repeatData: {
															...repeatData,
															[name]: value,
														},
													})
												}
												eventStartDate={startDate}
											/>
										)}
										<CustomerInput
											required={!blocked}
											value={customer}
											onChange={(option) =>
												this.setState({
													customer: option,
												})
											}
											changeForm={() =>
												this.setState({
													isAddCustomerForm: true,
												})
											}
										/>

										<FormGroup>
											<ServicesInput
												isAdminPanel
												showMoreOptions={
													showMoreOptions
												}
												defaultEmployee={employee}
												defaultResource={resource}
												required={!blocked}
												value={services}
												eventStartDate={startDate}
												updateState={(state) =>
													this.setState({
														services: state,
													})
												}
											/>

											{services.length === 0 && (
												<EmployeeAndResourceInputs
													employee={employee}
													updateEmployee={(state) =>
														this.setState({
															employee: state,
														})
													}
													resource={resource}
													updateResource={(state) =>
														this.setState({
															resource: state,
														})
													}
												/>
											)}
										</FormGroup>

										<FormControl>
											<Label
												htmlFor="customer_description"
												inputValue={
													customer_description
												}
											>
												Wiadomość dla klienta
											</Label>
											<Textarea
												id="customer_description"
												name="customer_description"
												onChange={this.onChange}
												value={customer_description}
											/>
										</FormControl>
									</div>
								</>
							)}

							{blocked && (
								<>
									<FormGroup>
										<Dropdown.InputContainer>
											<EmployeeInput
												required={
													Object.keys(resource)
														.length === 0
												}
												value={employee}
												onChange={(option) =>
													this.setState({
														employee: option,
													})
												}
												extraOptions={[
													{
														full_name: 'Wszystkich',
														id: null,
													},
												]}
												disabled={
													Object.keys(resource)
														.length > 0
												}
											/>
											<Dropdown.ClearBtn
												clear={() =>
													this.setState({
														employee: {},
													})
												}
												value={employee}
											/>
										</Dropdown.InputContainer>
									</FormGroup>

									<FormGroup>
										<Dropdown.InputContainer>
											<ResourceInput
												required={
													Object.keys(employee)
														.length === 0
												}
												value={resource}
												onChange={(option) =>
													this.setState({
														resource: option,
													})
												}
												disabled={
													Object.keys(employee)
														.length > 0
												}
											/>
											<Dropdown.ClearBtn
												clear={() =>
													this.setState({
														resource: {},
													})
												}
												value={resource}
											/>
										</Dropdown.InputContainer>
									</FormGroup>
								</>
							)}

							<FormControl>
								<Label
									htmlFor="private_description"
									inputValue={private_description}
								>
									{blocked
										? 'Powód'
										: 'Opis (widoczny dla personelu)'}
								</Label>
								<Textarea
									id="private_description"
									name="private_description"
									onChange={this.onChange}
									value={private_description}
								/>
							</FormControl>

							<ButtonContainer
								style={{ justifyContent: 'space-between' }}
							>
								<Button
									type="submit"
									success={!blocked}
									danger={blocked}
									small
									loading={loading}
									loadingText="Zapisywanie"
								>
									Zapisz {blocked ? 'blokadę' : 'wizytę'}
								</Button>

								<Button
									type="button"
									primary
									small
									onClick={() =>
										this.setState({
											showMoreOptions: !showMoreOptions,
										})
									}
								>
									{showMoreOptions ? 'Mniej' : 'Więcej'} opcji
								</Button>
							</ButtonContainer>
						</form>
					</Suspense>
				</ErrorBoundary>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	employees: state.data.employees,
	resources: state.data.business.resources,
	resourceMap: state.meetings.resourceMap,
})

export default connect(mapStateToProps, null)(AddMeetingAdminForm)
