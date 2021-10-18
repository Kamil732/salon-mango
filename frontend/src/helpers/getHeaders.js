import Cookies from 'js-cookie'

import store from '../redux/store'

const getCsrfToken = (csrf = false) => {
	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language':
				localStorage.getItem('locale') ||
				(navigator.language || navigator.userLanguage).split('-')[0],
		},
	}

	if (csrf) config.headers['X-CSRFToken'] = Cookies.get('csrftoken')

	return config
}

export default getCsrfToken
