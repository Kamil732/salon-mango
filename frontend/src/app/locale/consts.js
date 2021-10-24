export const COUNTRIES_DATA = Object.freeze({
	pl: {
		gdpr: true,
		name: 'Polska',
		zipCodeLength: 6,
		currency: {
			name: 'złoty',
			symbol: 'zł',
			code: 'PLN',
			namePlural: 'złotych',
		},
		distanceUnit: 'km',
	},
	us: {
		gdpr: false,
		name: 'United States of America',
		zipCodeLength: 5,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'USD',
			namePlural: 'dollars',
		},
		distanceUnit: 'mi',
	},
	gb: {
		gdpr: true,
		name: 'United Kingdom',
		zipCodeLength: 5,
		currency: {
			name: 'pound',
			symbol: '£',
			code: 'GBP',
			namePlural: 'pounds',
		},
		distanceUnit: 'mi',
	},
	au: {
		gdpr: false,
		name: 'Australia',
		zipCodeLength: 4,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'AUD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	ca: {
		gdpr: false,
		name: 'Canada',
		zipCodeLength: 6,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'CAD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	ie: {
		gdpr: true,
		name: 'Ireland',
		zipCodeLength: 4,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'EUR',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	nz: {
		gdpr: false,
		name: 'New Zealand',
		zipCodeLength: 4,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'NZD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	za: {
		gdpr: false,
		name: 'South Africa',
		zipCodeLength: 4,
		currency: {
			name: 'rand',
			symbol: 'R',
			code: 'ZAR',
			namePlural: 'rand',
		},
		distanceUnit: 'km',
	},
	zw: {
		gdpr: true,
		name: 'Zimbabwe',
		zipCodeLength: 4,
		currency: {
			name: 'dollar',
			symbol: '$',
			code: 'ZWD',
			namePlural: 'dollars',
		},
		distanceUnit: 'km',
	},
	my: {
		gdpr: false,
		name: 'Malaysia',
		zipCodeLength: 5,
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
