import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addCustomer } from '../../../redux/actions/data'
import setMeetingEndDate from '../../../helpers/setMeetingEndDate'

import CSRFToken from '../../CSRFToken'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import { FormControl, FormGroup } from '../../../layout/forms/Forms'
import Label from '../../../layout/forms/inputs/Label'
import Textarea from '../../../layout/forms/inputs/Textarea'
import ErrorBoundary from '../../ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import Modal from '../../../layout/Modal'
import axios from 'axios'
import getHeaders from '../../../helpers/getHeaders'

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
		businessId: PropTypes.number.isRequired,
		employees: PropTypes.array,
		customers: PropTypes.array,
		resources: PropTypes.array,
		servicesData: PropTypes.array.isRequired,
		startDate: PropTypes.instanceOf(Date),
		calendarStep: PropTypes.number,
		resourceMap: PropTypes.object.isRequired,
		changeEndDate: PropTypes.func.isRequired,
		addCustomer: PropTypes.func.isRequired,
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

			customer:
				props.customers.data.find(
					(customer) => customer.id === props.selected.data.customer
				) || {},
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
			description: props.selected.data.description,
			customer_description: props.selected.data.customer_description,
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	async componentDidMount() {
		const { businessId, addCustomer, selected } = this.props

		if (Object.keys(this.state.customer).length === 0) {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URL}/data/businesses/${businessId}/customers/${selected.data.customer}/`,
					getHeaders(true)
				)

				addCustomer(res.data)
				this.setState({
					customer: res.data,
				})
			} catch (error) {
				console.log(error)
			}
		}
	}

	componentDidUpdate(_, prevState) {
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
			description,
			customer_description,
		} = this.state

		const payload = blocked
			? {
					employee: employee?.id,
					resource: resource?.id,
					description,
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
					description,
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
			description,
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

							{selected.data.blocked ? (
								<EmployeeInput
									required={selected.data.blocked}
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
										required={!selected.data.blocked}
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
											required={!selected.data.blocked}
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
								<Label
									htmlFor="customer_description"
									inputValue={customer_description}
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

							<FormControl>
								<Label
									htmlFor="description"
									inputValue={description}
								>
									{selected.data.blocked
										? 'Powód'
										: 'Opis (widoczny dla personelu)'}
								</Label>
								<Textarea
									id="description"
									name="description"
									onChange={this.onChange}
									value={description}
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
									Usuń{' '}
									{selected.data.blocked ? 'urlop' : 'wizytę'}
								</Button>
								<Button
									type="submit"
									success
									small
									loading={saveLoading}
									loadingText="Zapisywanie"
									disabled={
										deleteLoading ||
										(employee === selected.data.employee &&
											customer ===
												selected.data.customer &&
											services === selected.data.services)
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
	businessId: state.data.business.data.id,
	employees: state.data.business.employees,
	customers: state.data.business.customers,
	resources: state.data.business.resources,
	servicesData: state.data.business.services,
	resourceMap: state.meetings.resourceMap,
})

const mapDispatchToProps = {
	addCustomer,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditMeetingAdminForm)
