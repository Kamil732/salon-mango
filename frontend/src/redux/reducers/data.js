import {
	ADD_UNREAD_NOTIFICATIONS_AMOUNT,
	CLEAR_NOTIFICATIONS,
	GET_BUSINESS_DATA,
	GET_NOTIFICATION,
	GET_NOTIFICATIONS,
	GET_NOTIFICATIONS_ERROR,
	GET_NOTIFICATIONS_UNREAD_AMOUNT,
	LOAD_EMPLOYEES,
	LOAD_CUSTOMERS,
	NOTIFICATIONS_LOADING,
	NOTIFICATION_CONNECT_WS,
	UPDATE_DATA,
	UPDATE_NOTIFICATION,
	LOGOUT,
	AUTH_ERROR,
	LOADING_BUSINESS_DATA,
} from '../actions/types'

import notifySound from '../../assets/sounds/pristine-609.mp3'

const initialState = {
	business: {
		loading: false,
		data: {},
	},
	employees: [],
	customers: [],
	notifications: {
		loading: false,
		ws: null,
		unRead: null,
		loaded: false,
		data: [],
	},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case LOADING_BUSINESS_DATA:
			return {
				...state,
				business: {
					loading: true,
					data: {},
				},
			}
		case UPDATE_DATA:
		case GET_BUSINESS_DATA:
			return {
				...state,
				business: {
					...state.business,
					loading: false,
					data: action.payload,
				},
			}
		case LOAD_EMPLOYEES:
			return {
				...state,
				employees: action.payload,
			}
		case LOAD_CUSTOMERS:
			let newCustomers = []

			// Iterate over payload and check if payload[i] is in customers
			// If it's not, then add it to state
			for (let i = 0; i < action.payload.length; i++) {
				const found = state.customers.some(
					(item) => item.id === action.payload[i].id
				)
				if (!found) newCustomers.push(action.payload[i])
			}

			return {
				...state,
				customers: [...state.customers, ...newCustomers],
			}
		case NOTIFICATION_CONNECT_WS:
			return {
				...state,
				notifications: {
					...state.notifications,
					ws: action.payload,
				},
			}
		case CLEAR_NOTIFICATIONS:
			if (state.notifications.ws) state.notifications.ws.destroy()

			return {
				...state,
				notifications: {
					...state.notifications,
					data: initialState.notifications.data,
					ws: initialState.notifications.ws,
					unRead: initialState.notifications.unRead,
					loading: initialState.notifications.loading,
					loaded: initialState.notifications.loaded,
				},
			}
		case NOTIFICATIONS_LOADING:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: true,
				},
			}
		case GET_NOTIFICATIONS_UNREAD_AMOUNT:
			return {
				...state,
				notifications: {
					...state.notifications,
					unRead: action.payload,
				},
			}
		case ADD_UNREAD_NOTIFICATIONS_AMOUNT:
			window.AudioContext =
				window.AudioContext || window.webkitAudioContext //fix up prefixing
			var context = new AudioContext() //context
			var source = context.createBufferSource() //source node
			source.connect(context.destination) //connect source to speakers so we can hear it
			var request = new XMLHttpRequest()
			request.open('GET', notifySound, true)
			request.responseType = 'arraybuffer' //the  response is an array of bits
			request.onload = function () {
				context.decodeAudioData(
					request.response,
					function (response) {
						source.buffer = response
						source.start(0) //play audio immediately
					},
					function () {
						console.error('The request failed.')
					}
				)
			}
			request.send()

			return {
				...state,
				notifications: {
					...state.notifications,
					unRead: state.notifications.unRead + action.payload,
				},
			}
		case GET_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: false,
					data: action.payload,
					loaded: true,
				},
			}
		case GET_NOTIFICATION:
			return {
				...state,
				notifications: {
					...state.notifications,
					data: [action.payload, ...state.notifications.data],
				},
			}
		case GET_NOTIFICATIONS_ERROR:
			return {
				...state,
				notifications: {
					...state.notifications,
					loading: false,
				},
			}
		case UPDATE_NOTIFICATION:
			return {
				...state,
				notifications: {
					...state.notifications,
					unRead:
						state.notifications.unRead -
						(action.payload?.read ? 1 : 0),
					data: state.notifications.data.map((notification) => {
						if (notification.id !== action.payload.id)
							return notification

						return {
							...notification,
							...action.payload,
						}
					}),
				},
			}
		case AUTH_ERROR:
		case LOGOUT:
			return {
				...state,
				business: initialState.business,
				employees: initialState.employees,
				customers: initialState.customers,
			}
		default:
			return state
	}
}
