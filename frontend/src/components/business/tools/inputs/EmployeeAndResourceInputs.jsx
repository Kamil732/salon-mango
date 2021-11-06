import React, { useState, Suspense, lazy } from 'react'
import { connect } from 'react-redux'

import { GrUserWorker } from 'react-icons/gr'
import { FiLayers } from 'react-icons/fi'

import ReactTooltip from 'react-tooltip'
import Modal from '../../../../layout/Modal'
import { FormGroup } from '../../../../layout/forms/Forms'
import {
	DropdownClearBtn,
	DropdownInputContainer,
} from '../../../../layout/buttons/dropdowns/Dropdown'
import Button from '../../../../layout/buttons/Button'
import ErrorBoundary from '../../../ErrorBoundary'
import CircleLoader from '../../../../layout/loaders/CircleLoader'

const EmployeeInput = lazy(() => import('./EmployeeInput'))
const ResourceInput = lazy(() => import('./ResourceInput'))

function EmployeeAndResourceInputs({
	employee,
	updateEmployee,
	resource,
	updateResource,
	resourcesLength,
}) {
	const [isOpen, setIsOpen] = useState(false)

	const getEmployeeInitial = (name) => {
		name = name.split(' ')
		if (name.length > 1)
			return `${name[0].charAt(0).toUpperCase()}.${name[1]
				.charAt(0)
				.toUpperCase()}.`

		return `${name[0].charAt(0).toUpperCase()}.`
	}

	const employeeInput = (
		<EmployeeInput
			required={Object.keys(resource).length === 0}
			value={employee}
			onChange={(option) => updateEmployee(option)}
		/>
	)

	const resourceInput =
		resourcesLength > 0 ? (
			<ResourceInput
				required={Object.keys(employee).length === 0}
				value={resource}
				onChange={(option) => updateResource(option)}
			/>
		) : null

	return (
		<>
			{isOpen && (
				<Modal closeModal={() => setIsOpen(false)} isChild small>
					<Modal.Header>Wybór pracownika i zasobów</Modal.Header>
					<Modal.Body>
						<ErrorBoundary>
							<Suspense
								fallback={
									<div className="center-container">
										<CircleLoader />
									</div>
								}
							>
								{Object.keys(resource).length === 0 ? (
									employeeInput
								) : (
									<FormGroup>
										<DropdownInputContainer>
											{employeeInput}
											<DropdownClearBtn
												clear={() => updateEmployee({})}
												value={employee}
											/>
										</DropdownInputContainer>
									</FormGroup>
								)}

								{resourceInput ? (
									Object.keys(employee).length === 0 ? (
										resourceInput
									) : (
										<FormGroup>
											<DropdownInputContainer>
												{resourceInput}
												<DropdownClearBtn
													clear={() =>
														updateResource({})
													}
													value={resource}
												/>
											</DropdownInputContainer>
										</FormGroup>
									)
								) : null}
							</Suspense>
						</ErrorBoundary>
					</Modal.Body>
				</Modal>
			)}

			<div className="inline-inputs">
				{/* Worker btn */}
				<Button
					type="button"
					onClick={() => setIsOpen(true)}
					className={`btn-picker ${employee ? employee.color : ''}`}
					data-tip={
						Object.keys(employee).length > 0
							? `pracownik: ${employee.name}`
							: 'brak pracownika'
					}
					style={{
						maxWidth: '100%',
					}}
					data-for="employeeBtnTip"
				>
					{Object.keys(employee).length > 0 ? (
						getEmployeeInitial(employee.name)
					) : (
						<GrUserWorker />
					)}
				</Button>
				<ReactTooltip id="employeeBtnTip" effect="solid" place="top" />

				{/* Resource btn */}
				<div
					style={{
						position: 'relative',
					}}
				>
					<Button
						type="button"
						onClick={() => setIsOpen(true)}
						className="btn-picker"
						style={{
							maxWidth: '100%',
						}}
						data-tip={
							Object.keys(resource).length > 0
								? `zasób: ${resource.name}`
								: 'brak zasobów'
						}
						data-for="resourcesBtnTip"
					>
						<FiLayers />
						{Object.keys(resource).length > 0 && (
							<div className="badge">1</div>
						)}
					</Button>

					<ReactTooltip
						id="resourcesBtnTip"
						effect="solid"
						place="top"
					/>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state) => ({
	resourcesLength: state.data.business.resources.length,
})

export default connect(mapStateToProps, null)(EmployeeAndResourceInputs)
