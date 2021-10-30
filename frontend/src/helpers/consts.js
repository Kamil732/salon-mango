import i18next from 'i18next'
import { COUNTRIES_DATA } from '../app/locale/consts'
import { country } from '../app/locale/location-params'

export const PRICE_TYPES = {
	FIXED: {
		label: i18next.t('price_types.fixed', { ns: 'business_common' }),
		value: 'X',
	},
	VARIES: {
		label: i18next.t('price_types.varies', { ns: 'business_common' }),
		value: 'V',
	},
	DONT_SHOW: {
		label: i18next.t('price_types.dont_show', { ns: 'business_common' }),
		value: 'D',
	},
	FREE: {
		label: i18next.t('price_types.free', { ns: 'business_common' }),
		value: 'F',
	},
	STARTS_AT: {
		label: i18next.t('price_types.starts_at', { ns: 'business_common' }),
		value: 'S',
	},
}

export const PRICE_TYPES_DATA = [
	PRICE_TYPES.FIXED,
	PRICE_TYPES.VARIES,
	PRICE_TYPES.DONT_SHOW,
	PRICE_TYPES.FREE,
	PRICE_TYPES.STARTS_AT,
]

export const TRAVEL_FEE_PRICE_TYPES_DATA = [
	PRICE_TYPES.FIXED,
	PRICE_TYPES.VARIES,
	PRICE_TYPES.FREE,
	PRICE_TYPES.STARTS_AT,
]

function getMapRadius(value) {
	return COUNTRIES_DATA[country].distanceUnit === 'mi'
		? value * 1609.344
		: value * 1000
}

export const MAX_TRAVEL_DISTANCES = [
	{
		label: '5 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(5),
		zoom: 11.5,
	},
	{
		label: '10 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(10),
		zoom: 10.5,
	},
	{
		label: '15 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(15),
		zoom: 10,
	},
	{
		label: '20 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(20),
		zoom: 9.5,
	},
	{
		label: '25 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(25),
		zoom: 9.25,
	},
	{
		label: '30 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(30),
		zoom: 9,
	},
	{
		label: '35 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(35),
		zoom: 8.75,
	},
	{
		label: '40 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(40),
		zoom: 8.5,
	},
	{
		label: '45 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(45),
		zoom: 8.25,
	},
	{
		label: '50 ' + COUNTRIES_DATA[country].distanceUnit,
		value: getMapRadius(50),
		zoom: 8,
	},
]
