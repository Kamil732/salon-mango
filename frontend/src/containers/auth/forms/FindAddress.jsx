import React from 'react'
import PropTypes from 'prop-types'

import { BsPlus, BsSearch } from 'react-icons/bs'
import FormControl from '../../../layout/forms/FormControl'
import Button from '../../../layout/buttons/Button'

function FindAddress({ onChange, address }) {
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
							id="address"
							name="address"
							onChange={onChange}
							value={address}
						/>
					</div>
				</div>

				<div className="space-between">
					<p className="text-broken">Nie możesz znaleźć adresu?</p>

					<Button
						secondary
						small
						className="icon-container"
						type="button"
					>
						<BsPlus size="20" className="icon-container__icon" />
						Dodaj adres
					</Button>
				</div>
			</FormControl>
		</>
	)
}

FindAddress.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	address: PropTypes.string,
}

export default FindAddress
