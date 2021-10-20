import React from 'react'
import PropTypes from 'prop-types'

import { FaMapMarkerAlt } from 'react-icons/fa'

import { FormControl } from '../../../../layout/forms/Forms'
import { GoogleMap, useJsApiLoader, Marker, Data } from '@react-google-maps/api'
import Card from '../../../../layout/Card'
import CircleLoader from '../../../../layout/loaders/CircleLoader'
import { useTranslation } from 'react-i18next'

function FindAddress({
	city,
	address,
	postal_code,
	latitude,
	longitude,
	updateData,
}) {
	const { t } = useTranslation()
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	})

	const center = {
		lat: latitude,
		lng: longitude,
	}

	return (
		<>
			<div className="title-container">
				<h2>{t('auth.register.find_address.title')}</h2>
				<p className="description">
					{t('auth.register.find_address.description')}
				</p>
			</div>

			{isLoaded ? (
				<FormControl>
					<Card className="address-card">
						<Card.Body>
							<div>
								<small className="text-broken">ADRES</small>
								<p>{address}</p>
								<p>{city}</p>
								<p>{postal_code}</p>
							</div>
							<FaMapMarkerAlt size="25" />
						</Card.Body>
					</Card>
					<GoogleMap
						mapContainerStyle={{
							width: '100%',
							height: '400px',
						}}
						center={center}
						zoom={13}
					>
						<Marker
							position={{
								lat: latitude,
								lng: longitude,
							}}
						/>

						<Data
							options={{
								controlPosition: window.google
									? window.google.maps.ControlPosition
											.TOP_LEFT
									: undefined,
								controls: ['Point'],
								drawingMode: 'Point',
								featureFactory: ({ g: { lat, lng } }) =>
									updateData({
										latitude: lat(),
										longitude: lng(),
									}),
							}}
						/>
					</GoogleMap>
				</FormControl>
			) : (
				<div className="center-container">
					<CircleLoader />
				</div>
			)}
		</>
	)
}

FindAddress.prototype.propTypes = {
	city: PropTypes.string.isRequired,
	address: PropTypes.string.isRequired,
	postal_code: PropTypes.string.isRequired,
	latitude: PropTypes.number,
	longitude: PropTypes.number,
	updateData: PropTypes.func.isRequired,
}

export default React.memo(FindAddress)
