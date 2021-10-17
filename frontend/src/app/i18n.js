import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n.on('languageChanged', () => {
	console.log('languageChanged')
})

i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		whitelist: ['en', 'pl'],
		fallbackLng: 'en',
		detection: {
			order: ['path'],
			lookupFromPathIndex: 0,
			checkWhitelist: true,
		},
		interpolation: {
			escapeValue: false,
			formatSeparator: '.',
		},
	})

export default i18n
