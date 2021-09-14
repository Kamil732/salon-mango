import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CSRFToken from '../../CSRFToken'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import ErrorBoundary from '../../ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import setMeetingEndDate from '../../../helpers/setMeetingEndDate'
import Modal from '../../../layout/Modal'

const AddCustomerForm = lazy(() => import('./AddCustomerForm'))
const EmployeeInput = lazy(() => import('../tools/inputs/EmployeeInput'))
const CustomerInput = lazy(() => import('../tools/inputs/CustomerInput'))
const ServicesInput = lazy(() => import('../tools/inputs/ServicesInput'))
const EmployeeAndResourceInputs = lazy(() =>
	import('../tools/inputs/EmployeeAndResourceInputs')
)

class EditMeetingAdminForm extends Component {
	static propTypes = {
		selected: PropTypes.object.isRequired,
		saveMeeting: PropTypes.func.isRequired,
		employees: PropTypes.array,
		customers: PropTypes.array,
		resources: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		loadCustomers: PropTypes.func.isRequired,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		resourceMap: PropTypes.object.isRequired,
		changeEndDate: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		// Get employee's id from resources
		const selectedResourceMap = props.resourceMap.isMany
			? props.resourceMap.data.find(
					({ id }) => id === props.selected.resourceId
			  )
			: props.resourceMap.selected

		this.state = {
			saveLoading: false,
			deleteLoading: false,
			isAddCustomerForm: false,

			customer: props.customers.find(
				(customer) => customer.id === props.selected.data.customer
			),
			employee: selectedResourceMap?.employeeId
				? props.employees.find(
						({ id }) => id === selectedResourceMap.employeeId
				  )
				: null,
			resource: selectedResourceMap?.resourceId
				? props.resources.find(
						({ id }) => id === selectedResourceMap.resourceId
				  )
				: null,
			services: props.selected.data.services.map((service) => ({
				resources: service.resources.map((resourceId) =>
					props.resources.find(
						(resource) => resource.id === resourceId
					)
				),
				employee: props.employees.find(
					(employee) => employee.id === service.employee
				),
				value: props.servicesData.find(
					(_service) => _service.id === service.id
				),
			})),
			private_description: props.selected.data.private_description,
			customer_description: props.selected.data.customer_description,
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.customers !== this.props.customers &&
			this.state.customer == null
		)
			this.setState({
				customer: this.props.customers.find(
					(customer) => customer.id === this.props.selected.customer
				),
			})

		setMeetingEndDate(
			prevState,
			this.state,
			this.props.startDate,
			this.props.calendarStep,
			this.props.changeEndDate
		)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()

		const {
			selected: { blocked },
		} = this.props
		const {
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

		await this.props.saveMeeting(payload, (state) =>
			this.setState({ saveLoading: state })
		)
	}

	render() {
		const { selected } = this.props
		const {
			saveLoading,
			deleteLoading,
			isAddCustomerForm,
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

							{selected.blocked ? (
								<EmployeeInput
									required={selected.blocked}
									value={employee}
									onChange={(option) =>
										this.setState({ employee: option })
									}
									extraChoices={[
										{
											label: 'Wszystkich',
											value: 'everyone',
										},
									]}
								/>
							) : (
								<>
									<CustomerInput
										required={!selected.blocked}
										value={customer}
										onChange={(option) =>
											this.setState({ customer: option })
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
											required={!selected.blocked}
											value={services}
											updateState={(state) =>
												this.setState({
													services: state,
												})
											}
											defaultEmployee={employee}
											defaultResource={resource}
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
								</>
							)}

							<FormControl>
								<FormControl.Label
									htmlFor="customer_description"
									inputValue={customer_description}
								>
									Wiadomość dla klienta
								</FormControl.Label>
								<FormControl.Textarea
									id="customer_description"
									name="customer_description"
									onChange={this.onChange}
									value={customer_description}
								/>
							</FormControl>

							<FormControl>
								<FormControl.Label
									htmlFor="private_description"
									inputValue={private_description}
								>
									{selected.blocked
										? 'Powód'
										: 'Opis (widoczny dla personelu)'}
								</FormControl.Label>
								<FormControl.Textarea
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
									type="button"
									danger
									small
									onClick={() =>
										this.props.deleteMeeting((state) =>
											this.setState({
												deleteLoading: state,
											})
										)
									}
									loading={deleteLoading}
									loadingText="Usuwanie"
									disabled={saveLoading}
								>
									Usuń {selected.blocked ? 'urlop' : 'wizytę'}
								</Button>
								<Button
									type="submit"
									success
									small
									loading={saveLoading}
									loadingText="Zapisywanie"
									disabled={
										deleteLoading ||
										(employee === selected.employee &&
											customer === selected.customer &&
											services === selected.services)
									}
								>
									Zapisz
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
	customers: state.data.customers,
	resources: state.data.salon.resources,
	servicesData: state.data.salon.services,
	resourceMap: state.meetings.resourceMap,
})

export default connect(mapStateToProps, null)(EditMeetingAdminForm)
