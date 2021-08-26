import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FiTrash2 } from 'react-icons/fi'
import { useId } from 'react-id-generator'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'
import Button from '../../../../layout/buttons/Button'

function ConsumptionInput(
	value,
	updateValue,
	options,
	products,
	dispatch,
	...props
) {
	products = []
	const [showInput, setShowInput] = useState(false)
	const [dropdownId] = useId(1, 'consumption-')

	useEffect(() => {
		if (value.length === 0 && !showInput) setShowInput(true)
	}, [value, showInput])

	const input = (
		<Dropdown
			id={dropdownId}
			value={value}
			getOptionLabel={(option) => option.name}
			getOptionValue={(option) => option.id}
			getValuesValue={(option) => option.id}
			options={options?.length > 0 ? options : products}
			isMulti
			autoFocus
			onChange={(option) => updateValue([...value, option])}
			setShowInput={setShowInput}
			{...props}
		/>
	)

	return (
		<>
			<div style={{ overflow: 'auto' }}>
				<table className="table-border">
					<thead>
						<th scope="col">nazwa</th>
						<th scope="col">jednostka</th>
						<th scope="col">ilość</th>
						<th scope="col">stan mag.</th>
					</thead>
					<tbody>
						<tr>
							{value.length > 0 ? (
								value.map((option) => (
									<>
										<td>Przykładowy Krem (towar)</td>
										<td>op.</td>
										<td>0 op.</td>
										<td>10 op.</td>
										<td className="delete-item-cell">
											<FiTrash2
												className="delete-item-cell__btn"
												onClick={() =>
													updateValue(
														value.filter(
															(_value) =>
																option.id !==
																_value.id
														)
													)
												}
											/>
										</td>
									</>
								))
							) : (
								<td colSpan="4">Brak dodanych produktów</td>
							)}
						</tr>
					</tbody>
				</table>
			</div>

			{showInput ? (
				input
			) : (
				<Button
					type="button"
					secondary
					small
					onClick={() => setShowInput(true)}
					style={{ margin: '0.5rem 0 ' }}
				>
					Dodaj produkt
				</Button>
			)}
		</>
	)
}

ConsumptionInput.prototype.propTypes = {
	value: PropTypes.array,
	options: PropTypes.array,
	products: PropTypes.array,
	updateValue: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	products: state.data.salon.products,
})

export default connect(mapStateToProps, null)(ConsumptionInput)
