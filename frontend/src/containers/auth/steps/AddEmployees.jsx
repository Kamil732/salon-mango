import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/css/table.css'

import ReactTooltip from 'react-tooltip'
import { IoIosArrowForward } from 'react-icons/io'
import { AiOutlinePlus } from 'react-icons/ai'
import { VscTrash } from 'react-icons/vsc'

import Modal from '../../../layout/Modal'
import { FormControl } from '../../../layout/forms/Forms'
import Label from '../../../layout/forms/inputs/Label'
import Input from '../../../layout/forms/inputs/Input'
import PhoneNumberInput from '../../../layout/forms/inputs/PhoneNumberInput'
import Button from '../../../layout/buttons/Button'

const initialEmployeeData = {
	name: '',
	email: '',
	phone_prefix: {},
	phone_number: '',
	position: '',
}

function AddEmployees({ name, employees }) {
	const [modalData, setModalData] = useState({
		isOpen: false,
		editMode: false,
	})
	const [employeeData, setEmployeeData] = useState(initialEmployeeData)

	const resetForm = () => {
		setModalData({
			isOpen: false,
			editMode: false,
		})
		setEmployeeData(initialEmployeeData)
	}

	const onChange = (e) =>
		setEmployeeData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))

	const onSubmit = (e) => {
		e.preventDefault()
	}

	return (
		<>
			{modalData.isOpen && (
				<Modal closeModal={resetForm} small isChild>
					<Modal.Header>
						{modalData.editMode ? 'Edytuj' : 'Dodaj'} pracownika
					</Modal.Header>
					<Modal.Body>
						<form onSubmit={onSubmit}>
							<FormControl>
								<Label
									htmlFor="name"
									inputValue={employeeData.name}
								>
									Imię i nazwisko
								</Label>
								<Input
									required
									id="name"
									name="name"
									value={employeeData.name}
									onChange={onChange}
								/>
							</FormControl>
							<FormControl>
								<Label
									htmlFor="email"
									inputValue={employeeData.email}
								>
									Adres e-mail
								</Label>
								<Input
									required
									id="email"
									name="email"
									value={employeeData.email}
									onChange={onChange}
								/>
							</FormControl>
							<PhoneNumberInput
								required
								phone_prefix={employeeData.phone_prefix}
								phone_number={employeeData.phone_number}
								onChange={onChange}
								onChangePrefix={(val) =>
									setEmployeeData((prevData) => ({
										...prevData,
										phone_prefix: val,
									}))
								}
							/>
							<FormControl>
								<Label
									htmlFor="position"
									inputValue={employeeData.position}
								>
									Stanowisko
								</Label>
								<Input
									id="position"
									name="position"
									value={employeeData.position}
									onChange={onChange}
								/>
							</FormControl>

							{modalData.editMode ? (
								<div className="space-between">
									<Button
										className="btn-picker"
										onClick={() => {}}
										type="button"
									>
										<VscTrash size="30" color="#eb0043" />
									</Button>
									<Button
										primary
										disabled={
											JSON.stringify(employeeData) ===
											JSON.stringify({})
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
				<h2>Dodaj pracowników</h2>
				<p className="description">
					Dodaj podstawowe informacje o swoim zespole. Do uzupełnienia
					profili, przypisania usług i ustalenia grafików pracy możesz
					wrócić później.
				</p>
			</div>

			<table className="step-table">
				<tbody>
					<tr>
						<td>{name}</td>
						<td className="text-broken">Właściciel</td>
					</tr>
					{employees.map((employee) => (
						<tr key={employee.id}>
							<td>{employee.name}</td>
							{employee.position && <td>{employee.position}</td>}
							<td style={{ width: '1px' }}>
								<ReactTooltip
									place="right"
									effect="solid"
									delayShow={250}
									id={`edit-tooltip-${employee.id}`}
								/>
								<Button
									rounded
									onClick={() =>
										this.onSelectService(employee)
									}
									data-for={`edit-tooltip-${employee.id}`}
									data-tip="Edytuj pracownika"
								>
									<IoIosArrowForward size="20" />
								</Button>
							</td>
						</tr>
					))}
					<tr>
						<td colSpan="2">
							<Button
								rounded
								className="icon-container"
								onClick={() =>
									setModalData((prevModalData) => ({
										...prevModalData,
										isOpen: true,
									}))
								}
							>
								<AiOutlinePlus
									size="20"
									className="icon-container__icon"
								/>
								Dodaj pracownika
							</Button>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	)
}

AddEmployees.prototype.propTypes = {
	name: PropTypes.string.isRequired,
	employees: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			name: PropTypes.string.isRequired,
			position: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
}

export default AddEmployees
