import moment from 'moment'
import {
	REMOVE_MEETING,
	MEETINGS_LOADING,
	LOAD_MEETINGS,
	CLEAR_MEETINGS,
	ADD_LOADED_DATES,
	CHANGE_VISIBLE_MEETINGS,
	UPDATE_MEETING,
	UPDATE_CALENDAR_DATES,
	UPDATE_RESOURCE_MAP,
	AUTH_ERROR,
	LOGOUT,
} from '../actions/types'

const initialState = {
	loading: false,
	data: [],
	visibleData: [],
	loadedDates: [],
	resourceMap: {
		isMany: null,
		selected:
			JSON.parse(localStorage.getItem(`resource-map-selected`)) || {},
		data: JSON.parse(localStorage.getItem(`resource-map-data`)) || [],
	},
	calendarDates: {
		currentDate: new Date(),
		startOfMonth: moment().startOf('month').startOf('week').toDate(),
		endOfMonth: moment().endOf('month').endOf('week').toDate(),
		startOfWeek: moment().startOf('week').toDate(),
		endOfWeek: moment().endOf('week').toDate(),
		startOf3days: moment().startOf('day').subtract(1, 'days').toDate(),
		endOf3days: moment().endOf('day').add(1, 'days').toDate(),
	},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case MEETINGS_LOADING:
			return {
				...state,
				loading: true,
			}
		case CLEAR_MEETINGS:
			return {
				...state,
				loadedDates: initialState.loadedDates,
				data: initialState.data,
				visibleData: initialState.visibleData,
				customerChoiceList: initialState.customerChoiceList,
			}
		case CHANGE_VISIBLE_MEETINGS:
			return {
				...state,
				visibleData: action.payload,
			}
		case ADD_LOADED_DATES:
			return {
				...state,
				loadedDates: [...state.loadedDates, ...action.payload],
				loading: false,
			}
		case LOAD_MEETINGS:
			return {
				...state,
				data: [...state.data, ...action.payload],
			}

		case REMOVE_MEETING:
			return {
				...state,
				data: state.data.filter(
					(meeting) => meeting.data.id !== action.payload
				),
			}
		case UPDATE_MEETING:
			return {
				...state,
				data: state.data.map((meeting) => {
					if (meeting.data.id === action.payload.data.id)
						return action.payload

					return meeting
				}),
			}
		case UPDATE_CALENDAR_DATES:
			return {
				...state,
				calendarDates: {
					currentDate: moment(action.payload).toDate(),
					startOfMonth: moment(action.payload)
						.startOf('month')
						.startOf('week')
						.toDate(),
					endOfMonth: moment(action.payload)
						.endOf('month')
						.endOf('week')
						.toDate(),
					startOfWeek: moment(action.payload)
						.startOf('week')
						.toDate(),
					endOfWeek: moment(action.payload).endOf('week').toDate(),
					startOf3days: moment(action.payload)
						.startOf('day')
						.subtract(1, 'days')
						.toDate(),
					endOf3days: moment(action.payload)
						.endOf('day')
						.add(1, 'days')
						.toDate(),
				},
			}
		case UPDATE_RESOURCE_MAP:
			if (action.payload.name !== 'isMany')
				localStorage.setItem(
					`resource-map-${action.payload.name}`,
					JSON.stringify(action.payload.value)
				)

			return {
				...state,
				resourceMap: {
					...state.resourceMap,
					[action.payload.name]: action.payload.value,
				},
			}
		case AUTH_ERROR:
		case LOGOUT:
			localStorage.removeItem('resource-map-data')
			localStorage.removeItem('resource-map-selected')

			return {
				...state,
				resourceMap: {
					isMany: null,
					selected: {},
					data: [],
				},
			}
		default:
			return state
	}
}
