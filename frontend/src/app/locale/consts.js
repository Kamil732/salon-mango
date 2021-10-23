export const COUNTRIES_DATA = Object.freeze({
	pl: {
		name: 'Polska',
		currency: {
			name: 'złoty',
			symbol: 'zł',
			code: 'PLN',
			namePlural: 'złotych',
		},
		distanceUnit: 'km',
	},
	us: {
		name: 'United States of America',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'USD',
			namePlural: 'dollars',
		},
		distanceUnit: 'mi',
	},
	gb: {
		name: 'United Kingdom',
		currency: {
			name: 'pound',
			symbol: '£',
			code: 'GBP',
			namePlural: 'pounds',
		},
		distanceUnit: 'mi',
	},
	au: {
		name: 'Australia',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'AUD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	ca: {
		name: 'Canada',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'CAD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	ie: {
		name: 'Ireland',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'EUR',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	nz: {
		name: 'New Zealand',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'NZD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	za: {
		name: 'South Africa',
		currency: {
			name: 'rand',
			symbol: 'R',
			code: 'ZAR',
			namePlural: 'rand',
		},
		distanceUnit: 'km',
	},
	zw: {
		name: 'Zimbabwe',
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'ZWD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	my: {
		name: 'Malaysia',
		currency: {
			name: 'ringgit',
			symbol: 'RM',
			code: 'MYR',
			namePlural: 'ringgits',
		},
		distanceUnit: 'km',
	},
})
export const SUPPORTED_COUNTRIES = Object.freeze(Object.keys(COUNTRIES_DATA))

export const LANGUAGE_NAMES = Object.freeze({
	pl: 'Polski',
	en: 'English (United States)',
})
export const SUPPORTED_LANGUAGES = Object.freeze(Object.keys(LANGUAGE_NAMES))
