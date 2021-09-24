import React, { useState, Suspense, lazy } from 'react'
import { connect } from 'react-redux'

import { GrUserWorker } from 'react-icons/gr'
import { FiLayers } from 'react-icons/fi'

import ReactTooltip from 'react-tooltip'
import Modal from '../../../../layout/Modal'
import { FormGroup } from '../../../../layout/forms/Forms'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'
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
	resources,
}) {
	const [isOpen, setIsOpen] = useState(false)

	const employeeInput = (
		<EmployeeInput
			required={resource === null}
			value={employee}
			onChange={(option) => updateEmployee(option)}
		/>
	)

	const resourceInput =
		resources.length > 0 ? (
			<ResourceInput
				required={employee === null}
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
								{resource === null ? (
									employeeInput
								) : (
									<FormGroup>
										<Dropdown.InputContainer>
											{employeeInput}
											<Dropdown.ClearBtn
												clear={() =>
													updateEmployee(null)
												}
												value={employee}
											/>
										</Dropdown.InputContainer>
									</FormGroup>
								)}

								{resourceInput ? (
									employee === null ? (
										resourceInput
									) : (
										<FormGroup>
											<Dropdown.InputContainer>
												{resourceInput}
												<Dropdown.ClearBtn
													clear={() =>
														updateResource(null)
													}
													value={resource}
												/>
											</Dropdown.InputContainer>
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
						employee
							? `pracownik: ${employee.full_name}`
							: 'brak pracownika'
					}
					style={{
						maxWidth: '100%',
					}}
					data-for="employeeBtnTip"
				>
					{employee ? (
						`${employee?.first_name.charAt(
							0
						)}.${employee?.last_name.charAt(0)}.`
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
							resource
								? `zasób: ${resource.name}`
								: 'brak zasobów'
						}
						data-for="resourcesBtnTip"
					>
						<FiLayers />
						{resource && <div className="badge">1</div>}
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
	resources: state.data.salon.resources,
})

export default connect(mapStateToProps, null)(EmployeeAndResourceInputs)
