import { country } from '../app/locale/location-params'
import { COUNTRIES_DATA } from '../app/locale/consts'

function getDistanceUnit() {
	return COUNTRIES_DATA[country].distanceUnit
}

function getCurrencySymbol() {
	return COUNTRIES_DATA[country].currency.symbol
}

function getMapRadius(value) {
	return getDistanceUnit() === 'mi' ? value * 1609.344 : value * 1000
}

export { getDistanceUnit, getMapRadius, getCurrencySymbol }
