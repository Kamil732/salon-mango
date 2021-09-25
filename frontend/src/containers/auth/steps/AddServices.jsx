import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../assets/css/table.css'

import { AiOutlinePlus } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'
import { VscTrash } from 'react-icons/vsc'

import { FormControl } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'
import DurationInput from '../../../layout/forms/inputs/DurationPicker'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'

import Button from '../../../layout/buttons/Button'
import Modal from '../../../layout/Modal'
import Dropdown from '../../../layout/buttons/dropdowns/Dropdown'
import ReactTooltip from 'react-tooltip'
import { IoIosArrowForward } from 'react-icons/io'

const PRICE_TYPES = require('../../../helpers/data/price_types.json')

const initialData = {
	name: '',
	price: null,
	price_type: PRICE_TYPES[2],
	time: 30,
	is_mobile: false,
}

function AddService({ services, work_remotely, setServices }) {
	const [modalData, setModalData] = useState({
		isOpen: false,
		editMode: false,
	})
	const [serviceData, setServiceData] = useState(initialData)

	const getSelectedService = useCallback(
		() => services.find((service) => service.id === serviceData.id),
		[services, serviceData.id]
	)

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
		setServiceData(initialData)
	}

	const addService = (e) => {
		e.preventDefault()

		const { name, price, time, price_type, is_mobile } = serviceData
		const id = nextId()

		setServices([
			...services,
			{
				id,
				name,
				price,
				time,
				price_type,
				is_mobile,
			},
		])

		resetForm()
	}

	const deleteService = () => {
		setServices(services.filter((service) => service.id !== serviceData.id))
		setModalData({
			...modalData,
			isOpen: false,
		})
	}

	const saveService = () => {
		setServices(
			services.map((service) =>
				service.id === serviceData.id ? serviceData : service
			)
		)
		setModalData({
			...modalData,
			isOpen: false,
		})
	}

	const onSelectService = (service) => {
		setServiceData(service)
		setModalData({
			...modalData,
			isOpen: true,
			editMode: true,
		})
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

						<FormControl>
							<Label htmlFor="name" inputValue={serviceData.name}>
								Nazwa usługi
							</Label>
							<Input
								id="name"
								name="name"
								value={serviceData.name}
								onChange={onChange}
							/>
						</FormControl>

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
									onClick={deleteService}
								>
									<VscTrash size="30" color="#eb0043" />
								</Button>
								<Button
									primary
									onClick={saveService}
									disabled={
										JSON.stringify(serviceData) ===
										JSON.stringify(getSelectedService())
									}
								>
									Zapisz
								</Button>
							</div>
						) : (
							<Button
								primary
								style={{ marginLeft: 'auto' }}
								onClick={addService}
							>
								Dodaj
							</Button>
						)}
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
					{services.map((service) => (
						<tr key={service.id}>
							<td
								className="inline-wrap"
								style={{ justifyContent: 'flex-start' }}
							>
								<ReactTooltip
									place="left"
									effect="solid"
									delayShow={250}
									id={`tooltip-${service.id}`}
								/>

								<Button
									rounded
									onClick={() =>
										setServices(
											services.filter(
												({ id }) => id !== service.id
											)
										)
									}
									data-for={`tooltip-${service.id}`}
									data-tip="Usuń usługę"
								>
									<GrClose size="20" opacity="0.4" />
								</Button>

								<span>{service.name}</span>
							</td>
							<td>{service.time}min</td>
							<td>
								<h4>{service.price} zł</h4>
							</td>
							<td style={{ width: '1px' }}>
								<Button
									rounded
									onClick={() => onSelectService(service)}
								>
									<IoIosArrowForward size="20" />
								</Button>
							</td>
						</tr>
					))}
					<tr>
						<td colSpan="3">
							<Button
								small
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
	setServices: PropTypes.func.isRequired,
}

export default AddService
