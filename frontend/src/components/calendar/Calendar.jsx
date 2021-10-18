import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../../assets/css/big-calendar.css'

import moment from 'moment'
import 'moment/locale/pl'
import getHeaders from '../../helpers/getHeaders'
import { NotificationManager } from 'react-notifications'

import axios from 'axios'
import {
	LOAD_MEETINGS,
	REMOVE_MEETING,
	UPDATE_MEETING,
} from '../../redux/actions/types'
import {
	connectMeetingWS,
	loadMeetings,
	changeVisibleMeetings,
	updateCalendarDates,
	updateResourceMap,
} from '../../redux/actions/meetings'

import CircleLoader from '../../layout/loaders/CircleLoader'
import ErrorBoundary from '../ErrorBoundary'
import Modal from '../../layout/Modal'

import {
	Calendar as BigCalendar,
	momentLocalizer,
	Views,
} from 'react-big-calendar'
import Day from 'react-big-calendar/lib/Day'

import Toolbar from './tools/Toolbar'
import TouchCellWrapper from './tools/TouchCellWrapper'
import WeekHeader from './tools/WeekHeader'
import MonthDateHeader from './tools/MonthDateHeader'
import ThreeDaysView from './tools/views/ThreeDaysView'
import EventWrapper from './tools/EventWrapper'
import getEventTooltip from '../../helpers/getEventTooltip'

const AddMeetingAdminForm = lazy(() => import('./forms/AddMeetingAdminForm'))
const EditMeetingAdminForm = lazy(() => import('./forms/EditMeetingAdminForm'))

moment.locale('US')
const localizer = momentLocalizer(moment)

class Calendar extends Component {
	static propTypes = {
		userId: PropTypes.number,
		ws: PropTypes.object,
		loading: PropTypes.bool,
		meetings: PropTypes.array,
		loadedDates: PropTypes.array,
		visibleMeetings: PropTypes.array,
		resourceMap: PropTypes.object.isRequired,
		employees: PropTypes.array,

		calendarDates: PropTypes.shape({
			currentDate: PropTypes.instanceOf(Date),
			startOfMonth: PropTypes.instanceOf(Date),
			endOfMonth: PropTypes.instanceOf(Date),
			startOfWeek: PropTypes.instanceOf(Date),
			endOfWeek: PropTypes.instanceOf(Date),
			startOf3days: PropTypes.instanceOf(Date),
			endOf3days: PropTypes.instanceOf(Date),
		}),

		changeVisibleMeetings: PropTypes.func.isRequired,
		connectMeetingWS: PropTypes.func.isRequired,
		loadMeetings: PropTypes.func.isRequired,
		updateResourceMap: PropTypes.func.isRequired,

		serivces: PropTypes.array,
		resourcesLength: PropTypes.number,
		calendar_step: PropTypes.number,
		calendar_timeslots: PropTypes.number,
		open_hours: PropTypes.array,
		blocked_hours: PropTypes.array,
	}

	constructor(props) {
		super(props)

		const calendarDates = this.getCalendarMinAndMaxTime()
		let view = localStorage.getItem('view')
		if (
			(view !== Views.WEEK &&
				view !== Views.MONTH &&
				view !== 'threedays' &&
				view !== 'reception') ||
			(view === 'reception' &&
				props.employees.length + props.resourcesLength <= 1)
		) {
			view = Views.WEEK
			localStorage.setItem('view', view)
		}

		this.state = {
			ws: null,
			windowWidth: window.innerWidth,

			view: window.innerWidth >= 768 ? view : Views.DAY,
			freeSlots: {},

			minDate: calendarDates.minDate,
			maxDate: calendarDates.maxDate,
			selected: {},
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
		this.getCalendarMinAndMaxTime = this.getCalendarMinAndMaxTime.bind(this)
		this.onNavigate = this.onNavigate.bind(this)
		this.onView = this.onView.bind(this)
		this.getDrilldownView = this.getDrilldownView.bind(this)
		this.onDrillDown = this.onDrillDown.bind(this)
		this.onRangeChange = this.onRangeChange.bind(this)
		this.eventPropGetter = this.eventPropGetter.bind(this)
		this.getIsDisabledSlot = this.getIsDisabledSlot.bind(this)
		this.getCountOfFreeSlotsAndMyMeetings =
			this.getCountOfFreeSlotsAndMyMeetings.bind(this)
		this.slotPropGetter = this.slotPropGetter.bind(this)
		this.onSelectEvent = this.onSelectEvent.bind(this)
		this.onSelectSlot = this.onSelectSlot.bind(this)
		this.openModal = this.openModal.bind(this)
		this.saveMeeting = this.saveMeeting.bind(this)
		this.deleteMeeting = this.deleteMeeting.bind(this)
		this.addMeeting = this.addMeeting.bind(this)
	}

	updateWindowDimensions = () =>
		this.setState({ windowWidth: window.innerWidth })

	getIsDisabledSlot = (date) => {
		const { open_hours, blocked_hours, visibleMeetings, calendar_step } =
			this.props
		const weekday = moment(date).day()
		const workDay = open_hours.find(
			(open_hour) => open_hour.weekday === weekday
		)

		// Check if it is a working day
		if (workDay == null) return true

		// Check if it is a blocked period
		for (let i = 0; i < visibleMeetings.length; i++) {
			if (
				visibleMeetings[i].start <= date &&
				visibleMeetings[i].end > date &&
				visibleMeetings[i].blocked
			)
				return true
		}

		// Check if data is in range of blocked hours
		const convertedDate = date.getHours() * 60 + date.getMinutes()
		for (let i = 0; i < blocked_hours.length; i++) {
			if (blocked_hours[i].weekday === weekday) {
				const blocked_from_hour =
					parseInt(blocked_hours[i].from_hour.split(':')[0]) * 60 +
					parseInt(blocked_hours[i].from_hour.split(':')[1])
				const blocked_to_hour =
					parseInt(blocked_hours[i].to_hour.split(':')[0]) * 60 +
					parseInt(blocked_hours[i].to_hour.split(':')[1])

				if (
					blocked_from_hour <= convertedDate &&
					blocked_to_hour > convertedDate
				)
					return true
			}
		}

		// Check if the date is in the range of open hours
		const work_from_hour =
			parseInt(workDay.from_hour.split(':')[0]) * 60 +
			parseInt(workDay.from_hour.split(':')[1])
		const work_to_hour =
			parseInt(workDay.to_hour.split(':')[0]) * 60 +
			parseInt(workDay.to_hour.split(':')[1])

		return (
			work_from_hour > convertedDate ||
			work_to_hour - calendar_step < convertedDate
		)
	}

	getCalendarMinAndMaxTime = () => {
		let { open_hours } = this.props
		const today = new Date()
		const fromHours = []
		const toHours = []

		if (open_hours.length === 0) {
			fromHours.push('10:00')
			toHours.push('19:00')
		}

		for (let i = 0; i < open_hours.length; i++) {
			fromHours.push(
				moment(
					new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate(),
						open_hours[i].from_hour.split(':')[0],
						open_hours[i].from_hour.split(':')[1]
					)
				)
			)
			toHours.push(
				moment(
					new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate(),
						open_hours[i].to_hour.split(':')[0],
						open_hours[i].to_hour.split(':')[1]
					)
				)
			)
		}

		const minDate = moment.min(fromHours)
		const maxDate = moment.max(toHours)

		return {
			minDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				minDate.hours(),
				minDate.minutes() -
					this.props.calendar_step * this.props.calendar_timeslots
			),

			maxDate: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
				maxDate.hours(),
				maxDate.minutes()
			),
		}
	}

	getVisibleMeetings = () => {
		const {
			meetings,
			calendarDates: {
				startOfMonth,
				startOfWeek,
				startOf3days,
				endOfMonth,
				endOfWeek,
				endOf3days,
			},
		} = this.props
		const { view } = this.state
		let visibleMeetings = []

		const start =
			view === Views.MONTH
				? startOfMonth
				: view === 'threedays'
				? startOf3days
				: startOfWeek
		const end =
			view === Views.MONTH
				? endOfMonth
				: view === 'threedays'
				? endOf3days
				: endOfWeek

		// Try to load meetings in new range
		if (this.props.loadedDates.length !== 0 && !this.props.loading)
			this.props.loadMeetings(start, end)

		setTimeout(() => {
			for (let i = 0; i < meetings.length; i++) {
				if (
					(meetings[i].start >= start && meetings[i].end <= end) ||
					(meetings[i].start <= start && meetings[i].end >= end) ||
					(meetings[i].start >= start &&
						end > this.props.meetings[i].start) ||
					(meetings[i].end <= end &&
						start < this.props.meetings[i].end)
				)
					visibleMeetings.push(meetings[i])
			}

			this.props.changeVisibleMeetings(visibleMeetings)
		}, 0)
	}

	getCountOfFreeSlotsAndMyMeetings = () => {
		const {
			open_hours,
			calendar_step,
			calendarDates: {
				startOfMonth,
				startOfWeek,
				startOf3days,
				endOfMonth,
				endOfWeek,
				endOf3days,
			},
		} = this.props
		const { view } = this.state

		const start =
			view === Views.MONTH
				? startOfMonth
				: view === 'threedays'
				? startOf3days
				: startOfWeek
		const end =
			view === Views.MONTH
				? endOfMonth
				: view === 'threedays'
				? endOf3days
				: endOfWeek

		let freeSlots = {}
		let currentDate = start
		while (currentDate <= end) {
			const convertedDate = moment(currentDate).format('YYYY-MM-DD')
			const weekday = moment(currentDate).day()
			const workDay = open_hours.find(
				(open_hour) => open_hour.weekday === weekday
			)
			if (!(convertedDate in freeSlots)) freeSlots[convertedDate] = 0

			if (workDay != null) {
				let currentTime = moment(workDay.from_hour, 'HH:mm').toDate()
				const toHour = moment(workDay.to_hour, 'HH:mm').toDate()
				while (currentTime < toHour) {
					const isDisabled = this.getIsDisabledSlot(
						moment(currentDate)
							.add(currentTime.getHours(), 'hours')
							.add(currentTime.getMinutes(), 'minutes')
							.toDate()
					)

					if (!isDisabled) freeSlots[convertedDate] += 1

					currentTime = moment(currentTime)
						.add(calendar_step, 'minutes')
						.toDate()
				}
			}

			const newCurrentDate = moment(currentDate).add(1, 'day').toDate()

			currentDate = newCurrentDate
		}
		this.setState({ freeSlots })
	}

	openModal = (type, selected) => {
		this.setState({
			selected: {
				selected_type: type,
				...selected,
			},
		})
	}

	componentDidMount = () => {
		const { view } = this.state
		const {
			ws,
			loading,
			loadedDates,
			updateResourceMap,
			loadMeetings,
			connectMeetingWS,
		} = this.props

		window.addEventListener('resize', this.updateWindowDimensions)
		updateResourceMap('isMany', view === 'reception')

		if (ws === null) connectMeetingWS()
		if (!loading && loadedDates.length === 0) loadMeetings()

		this.getVisibleMeetings()
		this.getCountOfFreeSlotsAndMyMeetings()
	}

	componentWillUnmount = () =>
		window.removeEventListener('resize', this.updateWindowDimensions)

	componentDidUpdate(prevProps, _) {
		if (this.props.open_hours !== prevProps.open_hours) {
			const calendarDates = this.getCalendarMinAndMaxTime()

			this.setState({
				minDate: calendarDates.minDate,
				maxDate: calendarDates.maxDate,
			})
			this.getCountOfFreeSlotsAndMyMeetings()
		}

		if (
			prevProps.loadedDates.length !== this.props.loadedDates.length &&
			!this.props.loading &&
			this.props.loadedDates.length === 0
		)
			this.props.loadMeetings()

		if (
			prevProps.meetings !== this.props.meetings ||
			prevProps.calendarDates.currentDate !==
				this.props.calendarDates.currentDate
		)
			this.getVisibleMeetings()

		if (prevProps.visibleMeetings !== this.props.visibleMeetings)
			this.getCountOfFreeSlotsAndMyMeetings()
	}

	deleteMeeting = async (loading = null) => {
		const { selected } = this.state

		if (loading) loading(true)

		try {
			await axios.delete(
				`${process.env.REACT_APP_API_URL}/meetings/${selected.id}/`,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: REMOVE_MEETING,
					payload: selected.id,
				})
			)

			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się usunąć wizyty', 'błąd')
		} finally {
			if (loading) loading(false)
		}
	}

	addMeeting = async (data, loading = null) => {
		const { start, end } = this.state.selected

		data.start = start
		data.end = end

		if (loading) loading(true)

		try {
			const body = JSON.stringify(data)
			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/meetings/`,
				body,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: LOAD_MEETINGS,
					payload: {
						id: res.data.id,
						from: res.data.start,
						to: res.data.end,
					},
				})
			)
			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać wizyty', 'błąd')
		} finally {
			if (loading) loading(false)
		}
	}

	saveMeeting = async (data, loading = null) => {
		const {
			selected: {
				data: { id, start, end },
			},
		} = this.state

		data.start = start
		data.end = end

		if (loading) loading(true)

		try {
			const body = JSON.stringify(data)

			const res = await axios.patch(
				`${process.env.REACT_APP_API_URL}/meetings/${id}/`,
				body,
				getHeaders(true)
			)

			this.props.ws.send(
				JSON.stringify({
					event: UPDATE_MEETING,
					payload: res.data.id,
				})
			)

			this.setState({ selected: {} })
		} catch (err) {
			NotificationManager.error('Nie udało się zapisać wizyty', 'Błąd')
		} finally {
			if (loading) loading(false)
		}
	}

	onNavigate = (date) => this.props.updateCalendarDates(date)

	onView = async (view) => {
		this.setState({ view })

		if (view === Views.MONTH)
			await this.onRangeChange([
				this.props.calendarDates.startOfMonth,
				this.props.calendarDates.endOfMonth,
			])
		else if (view === 'threedays')
			await this.onRangeChange([
				this.props.calendarDates.startOf3days,
				this.props.calendarDates.endOf3days,
			])

		setTimeout(this.getVisibleMeetings, 0)
	}

	getDrilldownView = (targetDate, currentViewName, configuredViewNames) => {
		if (
			currentViewName === Views.MONTH &&
			configuredViewNames.includes('threedays')
		)
			return 'threedays'

		return null
	}

	onDrillDown = (date, drilldownView) => {
		this.onNavigate(date)
		setTimeout(() => this.onView(drilldownView), 0)
	}

	onRangeChange = async (dates) => {
		const { view } = this.state

		const from =
			view === Views.MONTH
				? moment(dates.start).format('YYYY-MM-DD')
				: moment(dates[0]).format('YYYY-MM-DD')

		const to =
			view === Views.MONTH
				? moment(dates.end).format('YYYY-MM-DD')
				: moment(dates[dates.length - 1]).format('YYYY-MM-DD')

		await this.props.loadMeetings(from, to)
	}

	slotPropGetter = (date) => {
		const isDisabled = this.getIsDisabledSlot(date)

		return {
			className: isDisabled ? 'disabled' : '',
		}
	}

	eventPropGetter = ({ color: eventColor, data: event }) => {
		const { userId } = this.props

		return {
			className: `${event.blocked ? 'doNotWork' : ''} ${
				event.customer === userId && !event.blocked ? 'selectable' : ''
			} ${!event.blocked ? eventColor : ''}`,
		}
	}

	onSelectEvent = (event) => {
		const { userId } = this.props

		if (event.customer === userId && !event.blocked)
			this.openModal('event', event)
	}

	onSelectSlot = (slot) => {
		if (
			moment(slot.end).diff(moment(slot.start), 'days') > 0 ||
			parseInt(moment(slot.end).hours()) === 0
		) {
			this.openModal('slot', slot)
			return
		}

		const isDisabled = this.getIsDisabledSlot(slot.start)

		if (!isDisabled) this.openModal('slot', slot)
	}

	render() {
		const {
			loading,

			employees,
			userId,
			visibleMeetings,
			services,
			resourcesLength,
			resourceMap,
			calendarDates: {
				currentDate,
				startOfMonth,
				endOfMonth,
				startOfWeek,
				endOfWeek,
				startOf3days,
				endOf3days,
			},
			calendar_timeslots,
			calendar_step,
		} = this.props
		const { windowWidth, view, selected, minDate, maxDate, freeSlots } =
			this.state

		if (services.length === 0)
			return (
				<h1>
					Nie obsługujemy narazie żadnej wizyty zapraszamy w krótce :)
				</h1>
			)

		// Filter meetings that should be displayed
		let meetings = []

		for (let i = 0; i < visibleMeetings.length; i++) {
			const start =
				view === Views.MONTH
					? startOfMonth
					: view === 'threedays'
					? startOf3days
					: startOfWeek
			const end =
				view === Views.MONTH
					? endOfMonth
					: view === 'threedays'
					? endOf3days
					: endOfWeek

			if (
				(visibleMeetings[i].start >= start &&
					visibleMeetings[i].end <= end) ||
				(visibleMeetings[i].start <= start &&
					visibleMeetings[i].end >= end) ||
				(visibleMeetings[i].start >= start &&
					end > visibleMeetings[i].start) ||
				(visibleMeetings[i].end <= end &&
					start < visibleMeetings[i].end)
			) {
				if (
					// MONTH and allDay meeting
					((view === Views.MONTH && visibleMeetings[i].data.allDay) ||
						// Not MONTH
						view !== Views.MONTH ||
						// Not MONTH is blocked
						(view !== Views.MONTH &&
							visibleMeetings[i].data.blocked) ||
						// Is owner of meeting
						visibleMeetings[i].data.customer === userId) &&
					// Filter by resources
					((!resourceMap.isMany &&
						visibleMeetings[i].resourceId ===
							resourceMap.selected?.id) ||
						(resourceMap.isMany &&
							resourceMap.data.some(
								(resource) =>
									visibleMeetings[i].resourceId ===
									resource.id
							)))
				)
					meetings.push(visibleMeetings[i])
			}
		}

		console.log(view, meetings.length, visibleMeetings.length)

		const loader = (
			<div className="center-container">
				<CircleLoader />
			</div>
		)

		return (
			<>
				{Object.keys(selected).length > 0 && (
					<Modal closeModal={() => this.setState({ selected: {} })}>
						<Modal.Header>
							{moment(selected.end).diff(
								moment(selected.start),
								'days'
							) > 0 ||
							parseInt(moment(selected.end).hours()) === 0 ? (
								<>
									{moment(selected.start).format(
										'DD/MM/YYYY'
									)}{' '}
									-{' '}
									{moment(selected.end).format('DD/MM/YYYY')}
								</>
							) : (
								<>
									{moment(selected.start).format('DD/H:mm')} -{' '}
									{moment(selected.end).format('DD/H:mm')}
								</>
							)}
						</Modal.Header>
						<Modal.Body>
							<ErrorBoundary>
								<Suspense fallback={loader}>
									{selected.selected_type === 'event' ? (
										<EditMeetingAdminForm
											saveMeeting={this.saveMeeting}
											deleteMeeting={this.deleteMeeting}
											selected={selected}
											startDate={selected.start}
											calendarStep={calendar_step}
											changeEndDate={(date) =>
												this.setState({
													selected: {
														...selected,
														end: date,
													},
												})
											}
										/>
									) : (
										<AddMeetingAdminForm
											addMeeting={this.addMeeting}
											resourceId={selected.resourceId}
											isBlocked={
												selected.slots.length > 2 ||
												selected.start.getHours() * 60 +
													selected.start.getMinutes() ===
													0
											}
											startDate={selected.start}
											calendarStep={calendar_step}
											changeEndDate={(date) =>
												this.setState({
													selected: {
														...selected,
														end: date,
													},
												})
											}
										/>
									)}
								</Suspense>
							</ErrorBoundary>
						</Modal.Body>
					</Modal>
				)}

				<div
					style={{
						display: loading ? 'none' : 'block',
						width: '100%',
						height: '100%',
					}}
				>
					<BigCalendar
						onNavigate={this.onNavigate}
						onView={this.onView}
						onRangeChange={this.onRangeChange}
						localizer={localizer}
						events={meetings}
						step={calendar_step}
						timeslots={calendar_timeslots}
						views={Object.assign(
							{
								week: true,
								month: true,
								threedays: ThreeDaysView,
								day: true,
							},
							employees.length + resourcesLength > 1
								? { reception: Day }
								: {}
						)}
						view={view}
						date={currentDate}
						min={minDate}
						max={maxDate}
						dayLayoutAlgorithm="no-overlap"
						slotPropGetter={this.slotPropGetter}
						eventPropGetter={this.eventPropGetter}
						dayPropGetter={this.dayPropGetter}
						selectable={true}
						selected={selected}
						onSelectSlot={this.onSelectSlot}
						onSelectEvent={this.onSelectEvent}
						getDrilldownView={this.getDrilldownView}
						onDrillDown={this.onDrillDown}
						components={{
							eventWrapper: EventWrapper,
							toolbar: (props) => (
								<Toolbar windowWidth={windowWidth} {...props} />
							),
							timeSlotWrapper: (props) => (
								<TouchCellWrapper
									{...props}
									onSelectSlot={this.onSelectSlot}
								/>
							),
							timeGutterHeader: (props) => (
								<b style={{ margin: '0.5rem' }}>
									tydz. {moment(currentDate).week()}
								</b>
							),
							week: {
								header: (props) => (
									<WeekHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
							threedays: {
								header: (props) => (
									<WeekHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
							month: {
								dateHeader: (props) => (
									<MonthDateHeader
										{...props}
										freeSlots={freeSlots}
									/>
								),
							},
						}}
						titleAccessor={(event) =>
							getEventTooltip(event, services, false)
						}
						startAccessor={(event) =>
							event.data.blocked ? event.data.start : event.start
						}
						endAccessor={(event) =>
							event.data.blocked ? event.data.end : event.end
						}
						allDayAccessor={(event) => event.data.allDay}
						tooltipAccessor={null}
						resources={
							view === 'reception' ? resourceMap.data : null
						}
						messages={{
							month: 'Miesiąc',
							week: 'Tydzień',
							day: 'Dzień',
							reception: 'Recepcja',
							date: 'Data',
							event: 'Spotkanie',
							threedays: '3 Dni',
							showMore: (amount) => `+${amount} więcej`,
						}}
					/>
				</div>

				{loading && loader}
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	userId: state.auth.data.profile?.id,
	ws: state.meetings.ws,
	loading: state.meetings.loading,
	meetings: state.meetings.data,
	loadedDates: state.meetings.loadedDates,
	visibleMeetings: state.meetings.visibleData,
	calendarDates: state.meetings.calendarDates,
	resourceMap: state.meetings.resourceMap,
	employees: state.data.employees,
	resourcesLength: state.data.salon.resources.length,
	services: state.data.salon.services,
	calendar_step: state.data.salon.calendar_step,
	calendar_timeslots: state.data.salon.calendar_timeslots,
	open_hours: state.data.salon.open_hours,
	blocked_hours: state.data.salon.blocked_hours,
})

const mapDispatchToProps = {
	connectMeetingWS,
	loadMeetings,
	changeVisibleMeetings,
	updateCalendarDates,
	updateResourceMap,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
