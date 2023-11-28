import axios from 'axios'
import moment from 'moment'
import {
	LOGOUT,
	AUTH_LOADING,
	AUTH_SUCCESS,
	AUTH_ERROR,
	CLEAR_MEETINGS,
	CLEAR_NOTIFICATIONS,
} from './types'

import getHeaders from '../../helpers/getHeaders'

import { NotificationManager } from 'react-notifications'
import i18next from 'i18next'
import { getOrCreateBusinessData } from './data'

export const loadUser = () => async (dispatch) => {
	const body = JSON.stringify({
		weekday: moment().isoWeekday(),
	})

	dispatch({ type: AUTH_LOADING })

	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/accounts/current/`,
			getHeaders(true)
		)

		dispatch({
			type: AUTH_SUCCESS,
			payload: res.data,
		})
		await dispatch(getOrCreateBusinessData(res.data.businesses[0].id))
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		})
	}
}

export const login = (email, password, setErrors) => async (dispatch) => {
	const body = JSON.stringify({
		email,
		password,
		weekday: moment().isoWeekday(),
		// 'g-recaptcha-response': recaptchaToken,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/login/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: AUTH_SUCCESS,
			payload: res.data.user,
		})

		if (res.data.user.businesses.length > 0) {
			NotificationManager.success(res.data.message, 'Zalogowano')
			await dispatch(
				getOrCreateBusinessData(res.data.user.businesses[0].id)
			)
		}

		dispatch({ type: CLEAR_MEETINGS })
		dispatch({ type: CLEAR_NOTIFICATIONS })
	} catch (err) {
		if (err.response && setErrors) setErrors(err.response.data)
		else
			NotificationManager.error(
				i18next.t('error.description', { ns: 'common' }),
				i18next.t('error.title', { ns: 'common' })
			)

		dispatch({
			type: AUTH_ERROR,
		})
	}
}

export const register =
	({ email, password, name }) =>
	async (dispatch) => {
		const body = JSON.stringify({
			email,
			password,
			name,
			// 'g-recaptcha-response': recaptchaToken,
		})

		try {
			await axios.post(
				`${process.env.REACT_APP_API_URL}/accounts/register/`,
				body,
				getHeaders(true)
			)

			await dispatch(login(email, password))
		} catch (err) {
			if (err.response)
				for (const msg in err.response.data)
					NotificationManager.error(
						err.response.data[msg],
						msg === 'detail'
							? i18next.t('error.title', { ns: 'common' })
							: msg,
						5000
					)
			else
				NotificationManager.error(
					i18next.t('error.description', { ns: 'common' }),
					i18next.t('error.title', { ns: 'common' })
				)

			dispatch({
				type: AUTH_ERROR,
			})
		}
	}

export const logout = () => async (dispatch) => {
	const body = JSON.stringify({
		withCredentials: true,
	})

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/accounts/logout/`,
			body,
			getHeaders(true)
		)

		dispatch({
			type: LOGOUT,
		})
		NotificationManager.success(res.data.message)

		dispatch({ type: CLEAR_MEETINGS })
		dispatch({ type: CLEAR_NOTIFICATIONS })
	} catch (err) {
		if (err.response)
			for (const msg in err.response.data)
				NotificationManager.error(
					err.response.data[msg],
					msg === 'detail'
						? i18next.t('error.title', { ns: 'common' })
						: msg,
					5000
				)
		else
			NotificationManager.error(
				i18next.t('error.description', { ns: 'common' }),
				i18next.t('error.title', { ns: 'common' })
			)
	}
}
