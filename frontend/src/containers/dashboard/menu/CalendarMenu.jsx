import React, { useEffect, useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import 'react-calendar/dist/Calendar.css'

import moment from 'moment'
import { loadEmployees } from '../../../redux/actions/data'
import {
	updateCalendarDates,
	updateResourceMap,
} from '../../../redux/actions/meetings'

import Button from '../../../layout/buttons/Button'
import ErorrBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import { NotificationManager } from 'react-notifications'

const Calendar = lazy(() => import('react-calendar'))

function CalendarMenu({
	loadEmployees,
	employees,
	resources,
	resourceMap,
	currentDate,
	updateCalendarDates,
	updateResourceMap,
}) {
	const [activeDay, setActiveDay] = useState(currentDate)
	const formatShortWeekday = (_, date) => moment(date).format('dd')

	useEffect(() => {
		if (employees.length === 0) loadEmployees()
	}, [employees, loadEmployees])

	useEffect(() => {
		setActiveDay(currentDate)
	}, [currentDate])

	const onChange = (date) => updateCalendarDates(date)

	const onActiveStartDateChange = ({ activeStartDate }) =>
		setActiveDay(activeStartDate)

	const onChangeResource = (e) => {
		const resourceId = e.target.getAttribute('data-id')
		const resourceTitle = e.target.getAttribute('data-title')
		const resourceEmployeeId =
			parseInt(e.target.getAttribute('data-employee')) || null
		const resourceResourceId =
			parseInt(e.target.getAttribute('data-resource')) || null

		const data = {
			id: resourceId,
			title: resourceTitle,
			employeeId: resourceEmployeeId,
			resourceId: resourceResourceId,
		}

		if (!resourceMap.isMany) {
			updateResourceMap('selected', data)
			return
		}

		if (resourceMap.data.some(({ id }) => id === resourceId)) {
			if (resourceMap.data.length <= 1) {
				NotificationManager.error(
					'W widoku recepcji należy wybrać przynajmniej jednego pracownika.',
					'Błąd'
				)
				return
			}

			updateResourceMap(
				'data',
				resourceMap.data.filter(({ id }) => id !== resourceId)
			)
			return
		}

		updateResourceMap('data', [...resourceMap.data, data])
	}

	return (
		<div className="tools-menu">
			<ErorrBoundary>
				<Suspense fallback={<CircleLoader />}>
					<Calendar
						onChange={onChange}
						value={currentDate}
						activeStartDate={activeDay}
						onActiveStartDateChange={onActiveStartDateChange}
						locale="pl-PL"
						next2Label={null}
						prev2Label={null}
						minDetail="year"
						maxDetail="month"
						formatShortWeekday={formatShortWeekday}
						className="tools-menu__item"
						showFixedNumberOfWeeks
					/>
				</Suspense>
			</ErorrBoundary>

			{resourceMap.isMany !== null && (
				<>
					{employees.length > 0 && (
						<div className="tools-menu__item">
							<h4 className="tools-menu__item__title">
								PRACOWNICY
							</h4>

							{employees.map((employee) => {
								const isChecked = resourceMap.isMany
									? resourceMap.data.some(
											({ id }) =>
												id === `employee-${employee.id}`
									  )
									: resourceMap.selected?.id ===
									  `employee-${employee.id}`

								return (
									<div
										className={`btn-resources-container${
											isChecked ? ' active' : ''
										}`}
										key={employee.id}
									>
										<label>
											<input
												type={
													resourceMap.isMany
														? 'checkbox'
														: 'radio'
												}
												data-id={`employee-${employee.id}`}
												data-title={employee.full_name}
												data-employee={employee.id}
												checked={isChecked}
												onChange={onChangeResource}
											/>

											<span>{employee.full_name}</span>
											<div
												className={`box-color ${employee.color}`}
											></div>
										</label>
									</div>
								)
							})}
						</div>
					)}

					<div className="tools-menu__item">
						<h4 className="tools-menu__item__title">ZASOBY</h4>

						{resources.length > 0 ? (
							resources.map((resource) => {
								const isChecked = resourceMap.isMany
									? resourceMap.data.some(
											({ id }) =>
												id === `resource-${resource.id}`
									  )
									: resourceMap.selected?.id ===
									  `resource-${resource.id}`

								return (
									<div
										className={`btn-resources-container${
											isChecked ? ' active' : ''
										}`}
										key={resource.id}
									>
										<label>
											<input
												type={
													resourceMap.isMany
														? 'checkbox'
														: 'radio'
												}
												data-id={`resource-${resource.id}`}
												data-title={resource.name}
												data-resource={resource.id}
												checked={isChecked}
												onChange={onChangeResource}
											/>

											<span>{resource.name}</span>
											<div
												className={`box-color ${resource.color}`}
											></div>
										</label>
									</div>
								)
							})
						) : (
							<Button
								small
								primary
								to={
									process.env
										.REACT_APP_PANEL_SETTINGS_RESOURCES_URL
								}
								style={{
									fontSize: '0.75em',
								}}
								className="center-item"
							>
								Dodaj pierwszy zasób
							</Button>
						)}
					</div>
				</>
			)}
		</div>
	)
}

CalendarMenu.prototype.propTypes = {
	employees: PropTypes.array,
	resources: PropTypes.array,
	resourceMap: PropTypes.object.isRequired,
	currentDate: PropTypes.instanceOf(Date),
	loadEmployees: PropTypes.func.isRequired,
	updateCalendarDates: PropTypes.func.isRequired,
	updateResourceMap: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	employees: state.data.employees,
	resources: state.data.salon.resources,
	resourceMap: state.meetings.resourceMap,
	currentDate: state.meetings.calendarDates.currentDate,
})

const mapDispatchToProps = {
	updateCalendarDates,
	updateResourceMap,
	loadEmployees,
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarMenu)
