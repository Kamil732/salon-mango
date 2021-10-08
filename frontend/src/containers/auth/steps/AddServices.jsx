import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../assets/css/table.css'
import '../../../assets/css/register-add-services.css'

import { AiOutlinePlus } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'
import { VscTrash } from 'react-icons/vsc'
import { IoIosAdd, IoIosArrowForward } from 'react-icons/io'

import ReactTooltip from 'react-tooltip'
import Truncate from 'react-truncate'
import { FormControl, FormGroup } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'
import DurationInput from '../../../layout/forms/inputs/DurationPicker'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'
import Button from '../../../layout/buttons/Button'
import Modal from '../../../layout/Modal'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'

const PRICE_TYPES = require('../../../helpers/data/price_types.json')

const initialServiceData = {
	name: '',
	price: null,
	price_type: PRICE_TYPES[2],
	time: 30,
	is_mobile: false,
}

function AddService({
	services,
	work_remotely,
	categories,
	componentData,
	changeComponentData,
	setData,
}) {
	const [modalData, setModalData] = useState({
		isOpen: false,
		editMode: false,
	})
	const [serviceData, setServiceData] = useState(initialServiceData)
	const [suggestedHints, setSuggestedHints] = useState([])
	const allowFilter = useRef(true)
	const hints = useRef([])

	const getSelectedService = useCallback(
		() => services.find((service) => service.id === serviceData.id),
		[services, serviceData.id]
	)

	useEffect(() => {
		if (!componentData.loaded) {
			for (let i = 0; i < categories.length; i++) {
				import(`../../../helpers/data/services/${categories[i]}.json`)
					.then((module) => module.default)
					.then((data) => {
						const newData = data.map((hint, idx) => ({
							data: {
								...initialServiceData,
								...hint,
								id: nextId(),
							},
							sugest: idx > 2 ? true : false,
						}))
						hints.current = [...hints.current, ...newData]

						setData((prevData) => ({
							...prevData,
							services: [
								...prevData.services,
								{ ...newData[0].data },
								{ ...newData[1].data },
								{ ...newData[2].data },
							],
						}))
					})
			}

			changeComponentData({
				loaded: true,
			})
		}
	}, [])

	useEffect(() => {
		if (modalData.isOpen && !modalData.editMode) filterHints()
	}, [modalData])

	const onChange = (e) =>
		setServiceData((prevData) => ({
			...prevData,
			[e.target.name]:
				e.target.type === 'checkbox'
					? e.target.checked
					: e.target.value,
		}))

	const resetForm = () => {
		setModalData({
			...modalData,
			isOpen: false,
			editMode: false,
		})
		setServiceData(initialServiceData)
		setSuggestedHints([])
		allowFilter.current = true
	}

	const addService = (e) => {
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
		resetForm()

		// Try to remove hint from hints
		if (serviceData.id)
			hints.current.find(
				(hint) => hint.data.id === serviceData.id
			).sugest = false
	}

	const removeService = (id) => {
		setData((prevData) => ({
			...prevData,
			services: prevData.services.filter((service) => service.id !== id),
		}))
		resetForm()

		if (services.length === 1)
			changeComponentData({ nextBtnDisabled: true })

		// Try to add hint from hints
		const hintData = hints.current.find((hint) => hint.data.id === id)
		if (hintData) hintData.sugest = true
	}

	const saveService = () => {
		setData((prevData) => ({
			...prevData,
			services: prevData.services.map((service) =>
				service.id === serviceData.id ? serviceData : service
			),
		}))
		resetForm()
	}

	const onSelectService = (service) => {
		setServiceData(service)
		allowFilter.current = false
		setModalData({
			...modalData,
			isOpen: true,
			editMode: true,
		})
	}

	const filterHints = (value = '') => {
		let filteredHints = []

		for (let i = 0; i < hints.current.length; i++) {
			if (
				hints.current[i].sugest &&
				hints.current[i].data.name
					.toLowerCase()
					.includes(value.toLowerCase())
			)
				filteredHints.push(hints.current[i])

			if (filteredHints.length === 10) break
		}

		setSuggestedHints(filteredHints)
	}

	return (
		<>
			{modalData.isOpen && (
				<Modal closeModal={resetForm} small isChild>
					<Modal.Header>
						<h3>Dodaj usługę</h3>
					</Modal.Header>
					<Modal.Body>
						<p className="text-broken">
							Możesz dodać opis i zmienić ustawienia zaawansowane
							dla tej usługi później.
						</p>

						<form
							onSubmit={
								modalData.editMode ? saveService : addService
							}
						>
							<FormControl>
								<Label
									htmlFor="name"
									inputValue={serviceData.name}
								>
									Nazwa usługi
								</Label>
								<Input
									id="name"
									name="name"
									value={serviceData.name}
									onChange={(e) => {
										onChange(e)
										if (allowFilter.current)
											filterHints(e.target.value)
									}}
									autoComplete="off"
								/>
							</FormControl>

							{suggestedHints.length > 0 && (
								<FormControl>
									<fieldset>
										<legend>Sugerowane usługi</legend>
										<div className="inline-wrap wrap">
											{suggestedHints.map((hint) => (
												<Button
													key={hint.data.id}
													rounded
													small
													onClick={() => {
														setServiceData(
															hint.data
														)
														setSuggestedHints([])
														allowFilter.current = false
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
								<legend>Czas trwania usługi</legend>
								<DurationInput
									value={serviceData.time}
									onChange={(time) =>
										setServiceData((prevData) => ({
											...prevData,
											time,
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
										Cena
									</Label>
									<Input
										type="number"
										min="0"
										step="0.01"
										id="price"
										name="price"
										value={serviceData.price}
										onChange={onChange}
									/>
								</FormControl>
							</FormGroup>

							<FormControl>
								<Label htmlFor="price-type" inputValue>
									Rodzaj ceny
								</Label>
								<Dropdown
									id="price-type"
									options={PRICE_TYPES}
									getOptionLabel={(opt) => opt.label}
									getOptionValue={(opt) => opt.value}
									getValuesValue={(opt) => opt.value}
									value={serviceData.price_type}
									onChange={(price_type) => {
										setServiceData((prevData) => ({
											...prevData,
											price_type,
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
											onChange={onChange}
										/>
										Usługa mobilna
									</CheckBox.Label>
								</FormControl>
							)}

							{modalData.editMode ? (
								<div className="space-between">
									<Button
										className="btn-picker"
										onClick={() =>
											removeService(serviceData.id)
										}
										type="button"
									>
										<VscTrash size="30" color="#eb0043" />
									</Button>
									<Button
										primary
										disabled={
											JSON.stringify(serviceData) ===
											JSON.stringify(getSelectedService())
										}
										type="submit"
									>
										Zapisz
									</Button>
								</div>
							) : (
								<Button
									primary
									style={{ marginLeft: 'auto' }}
									type="submit"
								>
									Dodaj
								</Button>
							)}
						</form>
					</Modal.Body>
				</Modal>
			)}

			<div className="title-container">
				<h2>Dodaj pierwsze usługi</h2>
				<p className="description">
					Dodaj co najmniej jedną usługę z Twojej oferty. Później
					możesz dodać więcej usług, przypisać je do kategorii i
					edytować szczegóły.
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
											removeService(service.id)
										}
										data-for={`delete-tooltip-${service.id}`}
										data-tip="Usuń usługę"
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
								<td style={{ textAlign: 'center' }}>
									<h4>
										{service.price_type.value === 0
											? 'Darmowa'
											: service.price_type.value === 1
											? 'Cena zmienna'
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
										onClick={() => onSelectService(service)}
										data-for={`edit-tooltip-${service.id}`}
										data-tip="Edytuj usługę"
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
									setModalData({
										...modalData,
										isOpen: true,
									})
								}
							>
								<AiOutlinePlus
									size="20"
									className="icon-container__icon"
								/>
								Dodaj usługę
							</Button>
						</td>
					</tr>
					{services.length === 0 && (
						<tr>
							<td colSpan="3" className="text-broken text-center">
								Dodaj conajmniej jedną usługę, aby przejść dalej
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	)
}

AddService.prototype.propTypes = {
	services: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			time: PropTypes.string.isRequired,
			price: PropTypes.number.isRequired,
			price_type: PropTypes.string.isRequired,
			is_mobile: PropTypes.bool.isRequired,
		}).isRequired
	).isRequired,
	work_remotely: PropTypes.bool,
	categories: PropTypes.arrayOf([
		PropTypes.string.isRequired,
		PropTypes.string.isRequired,
	]).isRequired,
	setServices: PropTypes.func.isRequired,
}

export default AddService
