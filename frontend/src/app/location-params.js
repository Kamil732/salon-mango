import moment from 'moment'

export const COUNTRY_NAMES = Object.freeze({
	pl: 'Polska',
	us: 'United states of America',
	gb: 'United Kingdom',
	au: 'Australia',
	ca: 'Canada',
	ie: 'Ireland',
	nz: 'New Zealand',
	za: 'South Africa',
	zw: 'Zimbabwe',
	my: 'Malaysia',
})
export const SUPPORTED_COUNTRIES = Object.freeze(Object.keys(COUNTRY_NAMES))

export const LANGUAGE_NAMES = Object.freeze({
	pl: 'Polski',
	en: 'English (United States)',
})
export const SUPPORTED_LANGUAGES = Object.freeze(Object.keys(LANGUAGE_NAMES))

export const baseRouteUrl = `/:locale([a-z]{2}-[a-z]{2})*(/+)` // language-country

const re = new RegExp(`^(/([a-z]{2})-([a-z]{2}))/`)
const matches = window.location.pathname.match(re)
let baseUrl, language, country

function setLangAndCountry() {
	const usersLang = (navigator.language || navigator.userLanguage).split('-')
	language = localStorage.getItem('lang')
	country = localStorage.getItem('country')

	// Language
	if (!language && SUPPORTED_LANGUAGES.includes(usersLang[0]))
		language = usersLang[0]
	else if (!language) language = 'en'

	// Country
	if (!country && usersLang[1] && SUPPORTED_COUNTRIES.includes(usersLang[1]))
		country = usersLang[1].toLowerCase()
	else if (!country && SUPPORTED_COUNTRIES.includes(usersLang[0]))
		country = usersLang[0]
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
