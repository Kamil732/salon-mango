import Cookies from 'js-cookie'
import { language } from '../app/locale/location-params'

const getHeaders = (csrf = false) => {
	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': language,
		},
	}
	if (csrf) config.headers['X-CSRFToken'] = Cookies.get('csrftoken')

	return config
}

export default getHeaders
