import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { SUPPORTED_LANGUAGES } from './location-params'

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		whitelist: SUPPORTED_LANGUAGES,
		lng: localStorage.getItem('lang'),
		supportedLngs: SUPPORTED_LANGUAGES,

		interpolation: {
			escapeValue: false,
		},
		cache: {
			enabled: true,
			prefix: 'i18n-',
			expirationTime: 7 * 60 * 60 * 24 * 1000,
		},
		backend: {
			loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
		},
	})

export default i18n
