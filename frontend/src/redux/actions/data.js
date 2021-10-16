import {
	GET_SALON_DATA,
	GET_NOTIFICATIONS,
	NOTIFICATIONS_LOADING,
	GET_NOTIFICATIONS_ERROR,
	GET_NOTIFICATIONS_UNREAD_AMOUNT,
	UPDATE_NOTIFICATION,
	GET_NOTIFICATION,
	NOTIFICATION_CONNECT_WS,
	ADD_UNREAD_NOTIFICATIONS_AMOUNT,
	LOAD_EMPLOYEES,
	LOAD_CUSTOMERS,
} from './types'

import { NotificationManager } from 'react-notifications'

import getHeaders from '../../helpers/getHeaders'
import axios from 'axios'
import { updateResourceMap } from './meetings'

export const getSalonData = (salonId) => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/salons/${salonId}/`
		)

		dispatch({
			type: GET_SALON_DATA,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Wystąpił błąd przy wczytywaniu strony, spróbuj odświeżyć stronę',
			'Błąd',
			10 ** 6
		)
	}
}

export const loadEmployees = () => async (dispatch, getState) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/salons/${
				getState().data.salon.id
			}/employees/`
		)

		const data = {
			id: `employee-${res.data[0].id}`,
			title: res.data[0].name,
			employeeId: res.data[0].id,
			resourceId: null,
		}

		dispatch(
			updateResourceMap('data', [
				...getState().meetings.resourceMap.data,
				data,
			])
		)
		if (Object.keys(getState().meetings.resourceMap.selected).length === 0)
			dispatch(updateResourceMap('selected', data))

		dispatch({
			type: LOAD_EMPLOYEES,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się załadować listy fryzjerów',
			'Błąd',
			4000
		)
	}
}

export const loadCustomers = (value) => async (dispatch, getState) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/salons/${
				getState().data.salon.id
			}/customers/?search=${value}`
		)

		dispatch({
			type: LOAD_CUSTOMERS,
			payload: res.data,
		})

		value = value.toLowerCase()

		return getState().data.customers.filter(
			(customer) =>
				customer.full_name.toLowerCase().startsWith(value) ||
				customer.first_name.toLowerCase().startsWith(value) ||
				customer.last_name.toLowerCase().startsWith(value)
		)
	} catch (err) {
		NotificationManager.error(
			'Nie udało się załadować listy klientów',
			'Błąd',
			4000
		)
	}
}

export const addCustomer = (data) => async (dispatch) => {
	dispatch({
		type: LOAD_CUSTOMERS,
		payload: [data],
	})
}

export const getUnreadNotificationsAmount = () => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/notifications/unread-amount/`
		)

		dispatch({
			type: GET_NOTIFICATIONS_UNREAD_AMOUNT,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się wczytać liczby nieprzeczytanych powiadomień',
			'Błąd'
		)
	}
}

export const getNotifications = () => async (dispatch) => {
	dispatch({ type: NOTIFICATIONS_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/notifications/`
		)

		dispatch({
			type: GET_NOTIFICATIONS,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się załadować powiadomień',
			'Błąd',
			10 ** 6
		)

		dispatch({
			type: GET_NOTIFICATIONS_ERROR,
		})
	}
}

export const getNotification = (id) => async (dispatch) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/data/notifications/${id}/`
		)

		dispatch({
			type: GET_NOTIFICATION,
			payload: res.data,
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało się otrzymać powiadomienia',
			'Błąd'
		)
	}
}

export const markNotificationAsRead = (id) => async (dispatch) => {
	try {
		const body = JSON.stringify({ read: true })

		const res = await axios.patch(
			`${process.env.REACT_APP_API_URL}/data/notifications/${id}/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: UPDATE_NOTIFICATION,
			payload: {
				id,
				...res.data,
			},
		})
	} catch (err) {
		NotificationManager.error(
			'Nie udało zaznaczyć powiadomienia jako przeczytane',
			'Błąd'
		)
	}
}

export const connectNotificationWS =
	(timeout = 250) =>
	(dispatch, getState) => {
		const ws = new WebSocket(
			`${process.env.REACT_APP_SOCKET_URL}/notifications/`
		)
		let connectInterval = null
		let shouldAttemptReconnect = true

		// Check if websocket instance is closed, if so call `connect` function.
		const checkIsWebSocketClosed = () => {
			if (!ws || ws.readyState === WebSocket.CLOSED)
				dispatch(connectNotificationWS(timeout))
		}

		// websocket onopen event listener
		ws.onopen = () => {
			console.log('connected notification websocket')
			dispatch({
				type: NOTIFICATION_CONNECT_WS,
				payload: ws,
			})

			timeout = 250 // reset timer to 250 on open of websocket connection
			clearTimeout(connectInterval) // clear Interval on on open of websocket connection
			connectInterval = null
		}

		ws.onmessage = (e) => {
			const data = JSON.parse(e.data)

			switch (data.event) {
				case GET_NOTIFICATION:
					dispatch({
						type: ADD_UNREAD_NOTIFICATIONS_AMOUNT,
						payload: 1,
					})

					if (getState().data.notifications.data.length > 0)
						dispatch(getNotification(data.payload))

					break
				default:
					break
			}
		}

		ws.onclose = (e) => {
			if (shouldAttemptReconnect) {
				console.log(
					`Notification socket is closed. Reconnect will be attempted in ${Math.min(
						10000 / 1000,
						(timeout + timeout) / 1000
					)} second.`,
					e.reason
				)

				timeout += timeout //increment retry interval
				connectInterval = setTimeout(
					checkIsWebSocketClosed,
					Math.min(10000, timeout)
				) // Call checkIsWebSocketClosed function after timeout
			} else console.log('Closed notification websocket')
		}

		ws.destroy = () => {
			shouldAttemptReconnect = false
			ws.close()
		}

		ws.onerror = (err) => {
			console.error(
				'Notification socket encountered error: ',
				err.message,
				'Closing socket'
			)

			ws.close()
		}
	}
