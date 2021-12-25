import {
	REMOVE_MEETING,
	MEETINGS_LOADING,
	LOAD_MEETINGS,
	ADD_LOADED_DATES,
	CHANGE_VISIBLE_MEETINGS,
	UPDATE_MEETING,
	UPDATE_CALENDAR_DATES,
	UPDATE_RESOURCE_MAP,
} from './types'

import moment from 'moment'

import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import getHeaders from '../../helpers/getHeaders'

// Helper functions
const setMeeting = (data, getState) => {
	// Convert data
	data.start = moment(data.start).toDate()
	data.end = moment(data.end).toDate()

	if (
		data.do_not_work &&
		(moment(data.end).diff(moment(data.start), 'days') > 0 ||
			parseInt(moment(data.end).hours()) === 0)
	)
		data.allDay = true

	// Create support data
	let res = []
	for (let i = 0; i < data.services.length; i++) {
		const eventData = {
			id: data.services[i].id,
			start: moment(data.services[i].start).toDate(),
			end: moment(data.services[i].end).toDate(),
			data,
		}

		for (let j = 0; j < data.services[i].resources.length; j++)
			res.push({
				...eventData,
				color: getState().data.business.data.resources.find(
					({ id }) => id === data.services[i].resources[j]
				).color,
				resourceId: `resource-${data.services[i].resources[j]}`,
			})

		// TODO: TypeError: Cannot read property 'color' of undefined
		// TODO: Employees are not loaded yet
		res.push({
			...eventData,
			color: getState().data.business.employees.find(
				({ id }) => id === data.services[i].employee
			).color,
			resourceId: `employee-${data.services[i].employee}`,
		})
	}

	return res
}

const getDates = (from, to, loadedDates) => {
	let dates = []
	let currentDate = moment(from).toDate()

	while (currentDate.getTime() <= moment(to).toDate().getTime()) {
		const formatedDate = moment(currentDate).format('YYYY-MM-DD')

		if (!loadedDates.includes(formatedDate)) dates.push(formatedDate)

		currentDate = moment(currentDate).add(1, 'day').toDate()
	}

	return dates
}

export const updateCalendarDates = (data) => (dispatch) => {
	dispatch({
		type: UPDATE_CALENDAR_DATES,
		payload: data,
	})
}

export const updateResourceMap = (name, value) => (dispatch) => {
	dispatch({
		type: UPDATE_RESOURCE_MAP,
		payload: { name, value },
	})
}

export const addLoadedDates = (dates) => (dispatch) => {
	dispatch({
		type: ADD_LOADED_DATES,
		payload: dates,
	})
}

export const loadMeetings =
	(
		from = moment().startOf('month').startOf('week').format('YYYY-MM-DD'),
		to = moment().endOf('month').endOf('week').format('YYYY-MM-DD')
	) =>
	async (dispatch, getState) => {
		const dates = getDates(from, to, getState().meetings.loadedDates)

		if (dates.length > 0) {
			dispatch({ type: MEETINGS_LOADING })

			// try {
			let data = []
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/data/businesses/${
					getState().data.business.data.id
				}/meetings/?from=${dates[0]}&to=${dates[dates.length - 1]}`
			)

			for (let i = 0; i < res.data.length; i++)
				data.push(...setMeeting(res.data[i], getState))

			dispatch(addLoadedDates(dates))
			dispatch({
				type: LOAD_MEETINGS,
				payload: data,
			})
			// } catch (err) {
			// 	NotificationManager.error(
			// 		'Nie udało się załadować wizyt',
			// 		'Błąd'
			// 	)
			// 	console.error(`The error occurred: ${err}`)
			// }
		}
	}

export const createMeeting = (data) => async (dispatch, getState) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/data/businesses/${
				getState().data.business.data.id
			}/meetings/`,
			data,
			getHeaders(true)
		)

		dispatch({
			type: LOAD_MEETINGS,
			payload: setMeeting(res.data, getState),
		})
	} catch (err) {
		NotificationManager.error('Nie udało się zapisać wizyty', 'błąd')
	}
}

export const deleteMeeting = (id) => async (dispatch, getState) => {
	try {
		await axios.delete(
			`${process.env.REACT_APP_API_URL}/data/businesses/${
				getState().data.business.data.id
			}/meetings/${id}/`,
			getHeaders(true)
		)

		dispatch({
			type: REMOVE_MEETING,
			payload: id,
		})
	} catch (err) {
		NotificationManager.error('Nie udało się usunąć wizyty', 'błąd')
	}
}

export const updateMeeting = (id, data) => async (dispatch, getState) => {
	try {
		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}/data/businesses/${
				getState().data.business.data.id
			}/meetings/${id}/`,
			data,
			getHeaders(true)
		)

		dispatch({
			type: UPDATE_MEETING,
			payload: setMeeting(res.data, getState)[0], // get the first element from array
		})
	} catch (err) {
		NotificationManager.error('Nie udało się zapisać wizyty', 'Błąd')
	}
}

export const changeVisibleMeetings = (data) => (dispatch) => {
	dispatch({
		type: CHANGE_VISIBLE_MEETINGS,
		payload: data,
	})
}
