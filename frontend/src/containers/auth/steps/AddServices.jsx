import React, { useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../assets/css/table.css'

import { AiOutlinePlus } from 'react-icons/ai'
import { GrClose } from 'react-icons/gr'

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
	isMobile: false,
}

function AddService({ services, setServices }) {
	const [isOpen, setIsOpen] = useState(false)
	const [{ name, price, time, price_type, is_mobile }, setServiceData] =
		useState(initialData)

	const onChange = (e) =>
		setServiceData((prevData) => ({
			...prevData,
			[e.target.name]:
				e.target.type === 'checkbox'
					? e.target.checked
					: e.target.value,
		}))

	const addService = (e) => {
		e.preventDefault()

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

		setIsOpen(false)
	}

	return (
		<>
			{isOpen && (
				<Modal
					closeModal={() => {
						setIsOpen(false)
						setServiceData(initialData)
					}}
					small
					isChild
				>
					<Modal.Header>
						<h3>Dodaj usługę</h3>
					</Modal.Header>
					<Modal.Body>
						<p className="text-broken">
							Możesz dodać opis i zmienić ustawienia zaawansowane
							dla tej usługi później.
						</p>

						<FormControl>
							<Label htmlFor="name" inputValue={name}>
								Nazwa usługi
							</Label>
							<Input
								id="name"
								name="name"
								value={name}
								onChange={onChange}
							/>
						</FormControl>

						<fieldset>
							<legend>Czas trwania usługi</legend>
							<DurationInput
								value={time}
								onChange={(time) =>
									setServiceData((prevData) => ({
										...prevData,
										time,
									}))
								}
							/>
						</fieldset>

						<FormControl>
							<Label htmlFor="price" inputValue={price}>
								Cena
							</Label>
							<Input
								type="number"
								min="0"
								step="0.01"
								id="price"
								name="price"
								value={price}
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
								value={price_type}
								onChange={(price_type) => {
									setServiceData((prevData) => ({
										...prevData,
										price_type,
									}))
								}}
							/>
						</FormControl>

						<FormControl>
							<CheckBox.Label>
								<CheckBox
									name="is_mobile"
									checked={is_mobile}
									onChange={onChange}
								/>
								Usługa mobilna
							</CheckBox.Label>
						</FormControl>

						<Button
							type="submit"
							primary
							style={{ marginLeft: 'auto' }}
							onClick={addService}
						>
							Dodaj
						</Button>
					</Modal.Body>
				</Modal>
			)}

			<div className="title">
				<h2>Dodaj pierwsze usługi</h2>
				<p>
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
								<div
									className="inline-wrap"
									style={{ justifyContent: 'flex-end' }}
								>
									<h4>{service.price} zł</h4>
									<IoIosArrowForward size="20" />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<hr />
			<div style={{ margin: '1rem' }}>
				<Button
					small
					secondary
					className="icon-container"
					onClick={() => setIsOpen(true)}
				>
					<AiOutlinePlus size="20" className="icon-container__icon" />
					Dodaj usługę
				</Button>
			</div>
			<hr />
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
	setServices: PropTypes.func.isRequired,
}

export default AddService
