import React, { useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../../assets/css/table.css'

import ReactTooltip from 'react-tooltip'
import { IoIosArrowForward } from 'react-icons/io'
import { AiOutlinePlus } from 'react-icons/ai'
import { VscTrash } from 'react-icons/vsc'

import Modal from '../../../../layout/Modal'
import { FormControl } from '../../../../layout/forms/Forms'
import Label from '../../../../layout/forms/inputs/Label'
import Input from '../../../../layout/forms/inputs/Input'
import PhoneNumberInput from '../../../../layout/forms/inputs/PhoneNumberInput'
import Button from '../../../../layout/buttons/Button'
import { useTranslation } from 'react-i18next'

function AddEmployees({ name, phone_prefix, employees, setData }) {
	const { t } = useTranslation(['business_register', 'common'])
	const initialEmployeeData = useMemo(
		() => ({
			name: '',
			email: '',
			phone_prefix: phone_prefix,
			phone_number: '',
			position: '',
		}),
		[phone_prefix]
	)
	const [modalData, setModalData] = useState({
		isOpen: false,
		editMode: false,
	})
	const [employeeData, setEmployeeData] = useState(initialEmployeeData)
	const selectedDefaultEmployeeData = useRef({})

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

	const addEmployee = (e) => {
		e.preventDefault()

		setData((prevData) => ({
			...prevData,
			employees: [
				...prevData.employees,
				{
					id: nextId(),
					...employeeData,
				},
			],
		}))
		resetForm()
	}

	const removeEmployee = () => {
		setData((prevData) => ({
			...prevData,
			employees: prevData.employees.filter(
				(employee) => employee.id !== employeeData.id
			),
		}))
		resetForm()
	}

	const saveEmployee = (e) => {
		e.preventDefault()

		setData((prevData) => ({
			...prevData,
			employees: prevData.employees.map((employee) =>
				employee.id === employeeData.id ? employeeData : employee
			),
		}))
		resetForm()
	}

	const onSelectService = (employee) => {
		selectedDefaultEmployeeData.current = employee
		setModalData({
			isOpen: true,
			editMode: true,
		})
		setEmployeeData(employee)
	}

	return (
		<>
			{modalData.isOpen && (
				<Modal closeModal={resetForm} small isChild>
					<Modal.Header>
						{modalData.editMode
							? t('add_employees.edit')
							: t('add_employees.add')}
					</Modal.Header>
					<Modal.Body>
						<form
							onSubmit={
								modalData.editMode ? saveEmployee : addEmployee
							}
						>
							<FormControl>
								<Label
									htmlFor="name"
									inputValue={employeeData.name}
								>
									{t('data.name')}
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
									{t('auth.email')}
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
									{t('add_employees.position')}
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
										onClick={removeEmployee}
										type="button"
									>
										<VscTrash size="30" color="#eb0043" />
									</Button>
									<Button
										primary
										disabled={
											JSON.stringify(employeeData) ===
											JSON.stringify(
												selectedDefaultEmployeeData.current
											)
										}
										type="submit"
									>
										{t('actions.save', { ns: 'common' })}
									</Button>
								</div>
							) : (
								<Button
									primary
									style={{ marginLeft: 'auto' }}
									type="submit"
								>
									{t('actions.add', { ns: 'common' })}
								</Button>
							)}
						</form>
					</Modal.Body>
				</Modal>
			)}

			<div className="title-container">
				<h2>{t('add_employees.title')}</h2>
				<p className="description">{t('add_employees.description')}</p>
			</div>

			<table className="step-table">
				<tbody>
					<tr>
						<td>{name}</td>
						<td className="text-broken">
							{t('add_employees.owner')}
						</td>
					</tr>
					{employees.map((employee) => (
						<tr key={employee.id}>
							<td>{employee.name}</td>

							<td className="text-broken">{employee.position}</td>

							<td style={{ width: '1px' }}>
								<ReactTooltip
									place="right"
									effect="solid"
									delayShow={250}
									id={`edit-tooltip-${employee.id}`}
								/>
								<Button
									rounded
									onClick={() => onSelectService(employee)}
									data-for={`edit-tooltip-${employee.id}`}
									data-tip="Edytuj pracownika"
								>
									<IoIosArrowForward size="20" />
								</Button>
							</td>
						</tr>
					))}
					<tr>
						<td colSpan="3">
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
								{t('add_employees.add')}
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
	phone_prefix: PropTypes.object,
	employees: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			name: PropTypes.string.isRequired,
			position: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
	setData: PropTypes.func.isRequired,
}

export default AddEmployees
