import i18n from 'i18next'
import { getDistanceUnit, getMapRadius } from './countryData'

export const PRICE_TYPES = {
	FIXED: {
		label: i18n.t('price_types.fixed', { ns: 'business_common' }),
		value: 'X',
	},
	VARIES: {
		label: i18n.t('price_types.varies', { ns: 'business_common' }),
		value: 'V',
	},
	DONT_SHOW: {
		label: i18n.t('price_types.dont_show', { ns: 'business_common' }),
		value: 'D',
	},
	FREE: {
		label: i18n.t('price_types.free', { ns: 'business_common' }),
		value: 'F',
	},
	STARTS_AT: {
		label: i18n.t('price_types.starts_at', { ns: 'business_common' }),
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

export const MAX_TRAVEL_DISTANCES = [
	{
		label: '5 ' + getDistanceUnit(),
		value: getMapRadius(5),
		zoom: 11.5,
	},
	{
		label: '10 ' + getDistanceUnit(),
		value: getMapRadius(10),
		zoom: 10.5,
	},
	{
		label: '15 ' + getDistanceUnit(),
		value: getMapRadius(15),
		zoom: 10,
	},
	{
		label: '20 ' + getDistanceUnit(),
		value: getMapRadius(20),
		zoom: 9.5,
	},
	{
		label: '25 ' + getDistanceUnit(),
		value: getMapRadius(25),
		zoom: 9.25,
	},
	{
		label: '30 ' + getDistanceUnit(),
		value: getMapRadius(30),
		zoom: 9,
	},
	{
		label: '35 ' + getDistanceUnit(),
		value: getMapRadius(35),
		zoom: 8.75,
	},
	{
		label: '40 ' + getDistanceUnit(),
		value: getMapRadius(40),
		zoom: 8.5,
	},
	{
		label: '45 ' + getDistanceUnit(),
		value: getMapRadius(45),
		zoom: 8.25,
	},
	{
		label: '50 ' + getDistanceUnit(),
		value: getMapRadius(50),
		zoom: 8,
	},
]
