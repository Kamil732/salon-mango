import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

const SUPPORTED_LANGUAGES = ['en', 'pl']

i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		whitelist: SUPPORTED_LANGUAGES,
		fallbackLng: SUPPORTED_LANGUAGES[0],
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

export { SUPPORTED_LANGUAGES }
export default i18n
