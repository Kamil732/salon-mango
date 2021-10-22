import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { SUPPORTED_LANGUAGES } from './location-params'

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		whitelist: SUPPORTED_LANGUAGES.map((l) => l.code),
		fallbackLng: 'en',
		lng: localStorage.getItem('lang'),
		detection: {
			order: ['path'],
			lookupFromPathIndex: 0,
			checkWhitelist: true,
		},
		interpolation: {
			escapeValue: false,
			formatSeparator: '.',
		},

		backend: {
			loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
		},
	})

export default i18n
