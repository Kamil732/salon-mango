import moment from 'moment'
import { SUPPORTED_COUNTRIES, SUPPORTED_LANGUAGES } from './consts'

export const baseRouteUrl = `/:locale([a-z]{2}-[a-z]{2})*(/+)` // /language-country/

const re = new RegExp(`^(/([a-z]{2})-([a-z]{2}))/`)
const matches = window.location.pathname.match(re)
let baseUrl, language, country

function setLangAndCountry() {
	const [usersLang, usersCountry] = (
		navigator.language || navigator.userLanguage
	).split('-')
	language = localStorage.getItem('lang')
	country = localStorage.getItem('country')

	// Language
	if (!language && SUPPORTED_LANGUAGES.includes(usersLang))
		language = usersLang
	else if (!language) language = 'en'

	// Country
	if (!country && usersCountry && SUPPORTED_COUNTRIES.includes(usersCountry))
		country = usersCountry.toLowerCase()
	else if (!country && SUPPORTED_COUNTRIES.includes(usersLang))
		country = usersLang
	else if (!country) country = 'us'

	baseUrl = `/${language}-${country}/`
	localStorage.setItem('lang', language)
	localStorage.setItem('country', country)
}

if (matches) {
	baseUrl = matches[0]
	language = matches[matches.length - 2]
	country = matches[matches.length - 1].toLowerCase()

	// if unsupported language or country - redirect to the best match
	if (
		!SUPPORTED_COUNTRIES.includes(country) ||
		!SUPPORTED_LANGUAGES.includes(language)
	) {
		setLangAndCountry()

		const url = window.location.href.replace(matches[0], baseUrl)
		window.location.href = url
	}

	// if country language doesn't exist (eg. pl-en)
	// moment will find the first matching language
	moment.locale(`${language}-${country}`)
	document.querySelector('html').setAttribute('lang', language)

	localStorage.setItem('lang', language)
	localStorage.setItem('country', country)
} else setLangAndCountry()

export { baseUrl, language, country }
