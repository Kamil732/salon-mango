import {
	LOGOUT,
	AUTH_ERROR,
	AUTH_SUCCESS,
	AUTH_LOADING,
} from '../actions/types'

const initialState = {
	isAuthenticated: null,
	loading: null,
	data: {},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case AUTH_LOADING:
			return {
				...state,
				loading: true,
			}
		case AUTH_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				data: action.payload,
			}
		case AUTH_ERROR:
		case LOGOUT:
			return {
				...state,
				isAuthenticated: false,
				loading: false,
				data: initialState.data,
			}
		default:
			return state
	}
}
