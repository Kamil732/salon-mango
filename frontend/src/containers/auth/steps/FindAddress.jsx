import React from 'react'
import PropTypes from 'prop-types'

import FormControl from '../../../layout/forms/FormControl'
import { GoogleMap, useJsApiLoader, Marker, Data } from '@react-google-maps/api'

function FindAddress({ city, latitude, longitude, onChangeByKey }) {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	})

	const center =
		latitude === null && longitude === null
			? {
					lat: parseFloat(city.latitude),
					lng: parseFloat(city.longitude),
			  }
			: null

	return (
		<>
			<div className="title">
				<h2>Lokalizacja na mapie</h2>
				<p>
					Kliknij dokładnie w miejsce gdzie znajduję się twój lokal,
					tak aby pojawiła się nad nim pinezka
				</p>
			</div>

			<FormControl>
				{isLoaded && (
					<GoogleMap
						mapContainerStyle={{
							width: '400px',
							height: '400px',
						}}
						center={center}
						zoom={14}
					>
						{latitude !== null && longitude !== null && (
							<Marker
								position={{
									lat: latitude,
									lng: longitude,
								}}
							/>
						)}
						<Data
							options={{
								controlPosition: window.google
									? window.google.maps.ControlPosition
											.TOP_LEFT
									: undefined,
								controls: ['Point'],
								drawingMode: 'Point',
								featureFactory: ({ g: { lat, lng } }) => {
									onChangeByKey('latitude', lat())
									onChangeByKey('longitude', lng())
								},
							}}
						/>
					</GoogleMap>
				)}
			</FormControl>
		</>
	)
}

FindAddress.prototype.propTypes = {
	city: PropTypes.shape({
		city: PropTypes.string.isRequired,
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
	}).isRequired,
	latitude: PropTypes.number,
	longitude: PropTypes.number,
	onChangeByKey: PropTypes.func.isRequired,
}

export default React.memo(FindAddress)
