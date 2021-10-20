import React, { Component } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../../assets/css/table.css'
import '../../../../assets/css/register-add-services.css'

import axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { withTranslation } from 'react-i18next'
import getHeaders from '../../../../helpers/getHeaders'

import { AiOutlinePlus } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'
import { VscTrash } from 'react-icons/vsc'
import { IoIosAdd, IoIosArrowForward } from 'react-icons/io'

import ReactTooltip from 'react-tooltip'
import Truncate from 'react-truncate'
import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import CheckBox from '../../../../layout/forms/inputs/CheckBox'
import DurationInput from '../../../../layout/forms/inputs/DurationPicker'
import Input from '../../../../layout/forms/inputs/Input'
import Label from '../../../../layout/forms/inputs/Label'
import Button from '../../../../layout/buttons/Button'
import Modal from '../../../../layout/Modal'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

const PRICE_TYPES = require('../../../../assets/data/price_types.json')

const initialServiceData = {
	name: '',
	price: null,
	price_type: PRICE_TYPES[2],
	time: 30,
	is_mobile: false,
}

class AddService extends Component {
	static propTypes = {
		services: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
					.isRequired,
				name: PropTypes.string.isRequired,
				time: PropTypes.number.isRequired,
				price: PropTypes.number.isRequired,
				price_type: PropTypes.object.isRequired,
				is_mobile: PropTypes.bool.isRequired,
			}).isRequired
		).isRequired,
		work_remotely: PropTypes.bool,
		categories: PropTypes.arrayOf(PropTypes.string).isRequired,
		setData: PropTypes.func.isRequired,
		changeComponentData: PropTypes.func.isRequired,
		componentData: PropTypes.object.isRequired,
		t: PropTypes.func.isRequired,
		i18n: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)

		this.allowFilter = true
		this.hints = []
		this.selectedDefaultServiceData = {}

		this.state = {
			modalData: {
				isOpen: false,
				editMode: false,
			},
			serviceData: initialServiceData,
			suggestedHints: [],
		}
	}

	componentDidMount() {
		const {
			changeComponentData,
			componentData,
			categories,
			services,
			setData,
			t,
		} = this.props

		for (let i = 0; i < categories.length; i++) {
			axios
				.get(
					`${process.env.PUBLIC_URL}/data/services/${categories[
						i
					].replaceAll('-', '_')}.json`,
					getHeaders()
				)
				.then(({ data }) => {
					if (!componentData.loaded) {
						const newData = data.map((hint, idx) => ({
							data: {
								...initialServiceData,
								...hint,
								// price: parseFloat(hint.price),
								id: nextId(),
							},
							sugest: idx > 2 ? true : false,
						}))
						this.hints = [...this.hints, ...newData]

						setData((prevData) => ({
							...prevData,
							services: [
								...prevData.services,
								{ ...newData[0].data },
								{ ...newData[1].data },
								{ ...newData[2].data },
							],
						}))
					} else {
						let newData = []
						for (let i = 0; i < data.length; i++) {
							const serviceFromHint = services.find(
								(service) => service.name === data[i].name
							)
							const id = serviceFromHint?.id
								? serviceFromHint.id
								: nextId()

							newData.push({
								data: {
									...initialServiceData,
									...data[i],
									// price: parseFloat(data[i].price),
									id,
								},
								sugest: serviceFromHint?.id ? false : true,
							})
						}

						this.hints = [...this.hints, ...newData]
					}
				})
				.catch(() => {
					NotificationManager.error(
						t('auth.register.add_services.fetch_error'),
						t('Błąd')
					)
				})
		}

		if (!componentData.loaded)
			changeComponentData({
				loaded: true,
			})
	}

	componentDidUpdate(_, prevState) {
		if (
			prevState.modalData.isOpen !== this.state.modalData.isOpen &&
			this.state.modalData.isOpen &&
			this.allowFilter
		) {
			this.filterHints()
		}
	}

	filterHints = (value = '') => {
		let suggestedHints = []

		for (let i = 0; i < this.hints.length; i++) {
			if (
				this.hints[i].sugest &&
				this.hints[i].data.name
					.toLowerCase()
					.includes(value.toLowerCase())
			)
				suggestedHints.push(this.hints[i])

			if (suggestedHints.length === 10) break
		}

		this.setState({ suggestedHints })
	}

	onChange = (e) =>
		this.setState((prevState) => ({
			...prevState,
			serviceData: {
				...prevState.serviceData,
				[e.target.name]:
					e.target.type === 'checkbox'
						? e.target.checked
						: e.target.type === 'number'
						? parseFloat(e.target.value, 2)
						: e.target.value,
			},
		}))

	resetForm = () => {
		this.allowFilter = true

		this.setState({
			modalData: {
				isOpen: false,
				editMode: false,
			},
			serviceData: initialServiceData,
			suggestedHints: [],
		})
	}

	addService = (e) => {
		const { changeComponentData, services, setData } = this.props
		const { serviceData } = this.state
		e.preventDefault()

		if (services.length === 0)
			changeComponentData({ nextBtnDisabled: false })

		setData((prevData) => ({
			...prevData,
			services: [
				...prevData.services,
				{
					id: serviceData.id ? serviceData.id : nextId(),
					...serviceData,
				},
			],
		}))
		this.resetForm()

		// Try to remove hint from hints
		if (serviceData.id)
			this.hints.find(
				(hint) => hint.data.id === serviceData.id
			).sugest = false
	}

	removeService = (id) => {
		const { changeComponentData, services, setData } = this.props

		setData((prevData) => ({
			...prevData,
			services: prevData.services.filter((service) => service.id !== id),
		}))
		this.resetForm()

		if (services.length === 1)
			changeComponentData({ nextBtnDisabled: true })

		// Try to add hint from hints
		const hintData = this.hints.find((hint) => hint.data.id === id)
		if (hintData) hintData.sugest = true
	}

	saveService = (e) => {
		const { setData } = this.props
		const { serviceData } = this.state
		e.preventDefault()

		setData((prevData) => ({
			...prevData,
			services: prevData.services.map((service) =>
				service.id === serviceData.id ? serviceData : service
			),
		}))
		this.resetForm()
	}

	onSelectService = (service) => {
		this.allowFilter = false
		this.selectedDefaultServiceData = service

		setTimeout(
			() =>
				this.setState({
					modalData: {
						isOpen: true,
						editMode: true,
					},
					serviceData: service,
				}),
			0
		)
	}

	render() {
		const { services, work_remotely, t } = this.props
		const { modalData, serviceData, suggestedHints } = this.state

		return (
			<>
				{modalData.isOpen && (
					<Modal closeModal={this.resetForm} small isChild>
						<Modal.Header>
							<h3>
								{modalData.editMode
									? t('auth.register.add_services.edit')
									: t('auth.register.add_services.add')}
							</h3>
						</Modal.Header>
						<Modal.Body>
							<p className="text-broken">
								{t(
									'auth.register.add_services.modal.description'
								)}
							</p>

							<form
								onSubmit={
									modalData.editMode
										? this.saveService
										: this.addService
								}
							>
								<FormControl>
									<Label
										htmlFor="name"
										inputValue={serviceData.name}
									>
										{t(
											'auth.register.add_services.modal.service_name_label'
										)}
									</Label>
									<Input
										required
										id="name"
										name="name"
										value={serviceData.name}
										onChange={(e) => {
											this.onChange(e)
											if (this.allowFilter)
												this.filterHints(e.target.value)
										}}
										autoComplete="off"
									/>
								</FormControl>

								{suggestedHints.length > 0 && (
									<FormControl>
										<fieldset>
											<legend>
												{t(
													'auth.register.add_services.modal.service_suggested_services'
												)}
											</legend>
											<div className="inline-wrap wrap">
												{suggestedHints.map((hint) => (
													<Button
														key={hint.data.id}
														rounded
														small
														onClick={() => {
															this.setState({
																serviceData:
																	hint.data,
																suggestedHints:
																	[],
															})

															this.allowFilter = false
														}}
														className="service-suggestion-btn"
													>
														{hint.data.name}
														<span className="service-suggestion-btn__icon">
															<IoIosAdd size="25" />
														</span>
													</Button>
												))}
											</div>
										</fieldset>
									</FormControl>
								)}

								<fieldset>
									<legend>
										{t(
											'auth.register.add_services.modal.service_time_label'
										)}
									</legend>
									<DurationInput
										value={serviceData.time}
										onChange={(time) =>
											this.setState((prevState) => ({
												...prevState,
												serviceData: {
													...prevState.serviceData,
													time,
												},
											}))
										}
									/>
								</fieldset>

								<FormGroup className="space-between">
									<FormControl.Prefix>zł</FormControl.Prefix>
									<FormControl>
										<Label
											htmlFor="price"
											inputValue={serviceData.price}
										>
											{t(
												'auth.register.add_services.modal.service_price_label'
											)}
										</Label>

										<Input
											required
											type="number"
											min="0"
											step="0.01"
											id="price"
											name="price"
											value={serviceData.price}
											onInput={this.onChange}
											disabled={
												serviceData.price_type.value !==
													2 &&
												serviceData.price_type.value !==
													4
											}
										/>
									</FormControl>
								</FormGroup>

								<FormControl>
									<Label htmlFor="price-type" inputValue>
										{t('data.price_type.name')}
									</Label>
									<Dropdown
										id="price-type"
										options={PRICE_TYPES}
										getOptionLabel={(opt) => opt.label}
										getOptionValue={(opt) => opt.value}
										getValuesValue={(opt) => opt.value}
										value={serviceData.price_type}
										onChange={(price_type) => {
											this.setState((prevState) => ({
												...prevState,
												serviceData: {
													...prevState.serviceData,
													price_type,
												},
											}))
										}}
									/>
								</FormControl>

								{work_remotely && (
									<FormControl>
										<CheckBox.Label>
											<CheckBox
												name="is_mobile"
												checked={serviceData.is_mobile}
												onChange={this.onChange}
											/>
											{t(
												'auth.register.add_services.modal.service_is_remote'
											)}
										</CheckBox.Label>
									</FormControl>
								)}

								{modalData.editMode ? (
									<div className="space-between">
										<Button
											className="btn-picker"
											onClick={() =>
												this.removeService(
													serviceData.id
												)
											}
											type="button"
										>
											<VscTrash
												size="30"
												color="#eb0043"
											/>
										</Button>
										<Button
											primary
											disabled={
												JSON.stringify(serviceData) ===
												JSON.stringify(
													this
														.selectedDefaultServiceData
												)
											}
											type="submit"
										>
											{t('actions.save')}
										</Button>
									</div>
								) : (
									<Button
										primary
										style={{ marginLeft: 'auto' }}
										type="submit"
									>
										{t('actions.add')}
									</Button>
								)}
							</form>
						</Modal.Body>
					</Modal>
				)}

				<div className="title-container">
					<h2>{t('auth.register.add_services.title')}</h2>
					<p className="description">
						{t('auth.register.add_services.description')}
					</p>
				</div>

				<table className="step-table">
					<tbody>
						{services.map((service) => {
							const h = Math.floor(service.time / 60)
							const m = Math.round(service.time % 60)

							return (
								<tr key={service.id}>
									<td
										className="inline-wrap"
										style={{ justifyContent: 'flex-start' }}
									>
										<ReactTooltip
											place="left"
											effect="solid"
											delayShow={250}
											id={`delete-tooltip-${service.id}`}
										/>

										<Button
											rounded
											onClick={() =>
												this.removeService(service.id)
											}
											data-for={`delete-tooltip-${service.id}`}
											data-tip={t(
												'auth.register.add_services.delete'
											)}
										>
											<GrClose size="20" opacity="0.4" />
										</Button>

										<Truncate lines={1} trimWhitespace>
											{service.name}
										</Truncate>
									</td>
									<td className="text-broken">
										{h > 0 && `${h}h `}
										{m > 0 && `${m}m`}
									</td>
									<td className="text-center">
										<h4>
											{service.price_type.value === 0
												? t('data.price_type.free')
												: service.price_type.value === 1
												? t('data.price_type.varies')
												: service.price_type.value === 3
												? '--'
												: `${service.price} zł`}
										</h4>
									</td>
									<td style={{ width: '1px' }}>
										<ReactTooltip
											place="right"
											effect="solid"
											delayShow={250}
											id={`edit-tooltip-${service.id}`}
										/>
										<Button
											rounded
											onClick={() =>
												this.onSelectService(service)
											}
											data-for={`edit-tooltip-${service.id}`}
											data-tip={t(
												'auth.register.add_services.edit'
											)}
										>
											<IoIosArrowForward size="20" />
										</Button>
									</td>
								</tr>
							)
						})}
						<tr>
							<td colSpan="3">
								<Button
									rounded
									className="icon-container"
									onClick={() =>
										this.setState({
											modalData: {
												editMode: false,
												isOpen: true,
											},
										})
									}
								>
									<AiOutlinePlus
										size="20"
										className="icon-container__icon"
									/>
									{t('auth.register.add_services.add')}
								</Button>
							</td>
						</tr>
						{services.length === 0 && (
							<tr>
								<td
									colSpan="3"
									className="text-broken text-center"
								>
									{t('auth.register.add_services.warning')}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</>
		)
	}
}

export default withTranslation()(AddService)
