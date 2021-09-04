import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { BsPlus, BsSearch } from 'react-icons/bs'
import useDebounce from '../../../helpers/hooks/debounce'

import FormControl from '../../../layout/forms/FormControl'
import Button from '../../../layout/buttons/Button'
import Card from '../../../layout/cards/Card'
import CardContainer from '../../../layout/cards/CardContainer'
import CircleLoader from '../../../layout/loaders/CircleLoader'

function FindAddress({ nextStep, searchAddress }) {
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [filteredCities, filterCities] = useState([])
	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		if (debouncedSearch.length < 2) return
		setLoading(true)
		if (debouncedSearch) {
			const fetchData = async () => {
				// const config = {
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 	},
				// }

				// const res = await axios.get(
				// 	`http://www.mapquestapi.com/search/v3/prediction?q=${debouncedSearch}&countryCode=pl&collection=address,adminArea,airport,category,franchise,poi&limit=15&key=${process.env.REACT_APP_MAPQUEST_KEY}`,
				// 	config
				// )

				// Ask in form for a postal code & then to choose a city for dropdown
				// const res = await axios.get(
				// 	`https://app.zipcodebase.com/api/v1/search?codes=${debouncedSearch}&apikey=d8d66b60-0b62-11ec-96f1-4fef55f384da`
				// )

				const config = {
					headers: {
						'X-CSCAPI-KEY':
							'dXdTRkNMN01PYmRlUkh5OTlWMmFyQVJkWngwUlZjTFdTa2l4b1R6Zw==',
					},
				}

				const res = await axios.get(
					`https://api.countrystatecity.in/v1/countries/PL/cities/`,
					config
				)

				// filterCities(res.data.results)
			}

			fetchData()
			setLoading(false)
		}
	}, [debouncedSearch])

	return (
		<>
			<div className="title">
				<h2>Twój adres</h2>
				<p>Gdzie można cię znaleźć?</p>
			</div>

			<FormControl>
				<div className="inline-wrap" style={{ marginBottom: '2.5rem' }}>
					<BsSearch size="20" />

					<div
						style={{
							position: 'relative',
							width: '100%',
						}}
					>
						<FormControl.Input
							placeholder="Szukaj"
							type="text"
							id="searchAddress"
							name="searchAddress"
							onChange={(e) => setSearch(e.target.value)}
							value={searchAddress}
							max="100"
						/>
					</div>
				</div>

				{loading ? (
					<div className="center-container">
						<CircleLoader />
					</div>
				) : filteredCities.length > 0 ? (
					<CardContainer vertical>
						{filteredCities.map((city, idx) => (
							<Card key={idx}>
								<Card.Body>{city.displayString}</Card.Body>
							</Card>
						))}
					</CardContainer>
				) : debouncedSearch.length > 0 ? (
					<div className="title">
						<h4>Nie znaleziono wyników</h4>
						<p>Sprawdź pisownię</p>
					</div>
				) : (
					<div className="title">
						<h4>Zacznij pisać</h4>

						<p>Wprowadź conajmniej 2 znaki</p>
					</div>
				)}
			</FormControl>

			<div className="space-between">
				<p className="text-broken">Nie możesz znaleźć adresu?</p>

				<Button
					secondary
					small
					className="icon-container"
					type="button"
					onClick={nextStep}
				>
					<BsPlus size="20" className="icon-container__icon" />
					Dodaj adres
				</Button>
			</div>
		</>
	)
}

FindAddress.prototype.propTypes = {
	nextStep: PropTypes.func.isRequired,
	searchAddress: PropTypes.string,
}

export default FindAddress
