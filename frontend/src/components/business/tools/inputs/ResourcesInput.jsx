import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useId } from 'react-id-generator'
import '../../../../assets/css/table.css'

import { FiTrash2 } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import Button from '../../../../layout/buttons/Button'

import { FormControl } from '../../../../layout/forms/Forms'
import Label from '../../../../layout/forms/inputs/Label'
import Dropdown from '../../../../layout/buttons/dropdowns/Dropdown'

function ResourcesInput({
	value,
	options,
	resources,
	addValue,
	removeValue,
	...props
}) {
	const [showInput, setShowInput] = useState(value.length === 0)
	const [dropdownId] = useId(1, 'resource-')
	const [multiListId] = useId(1, 'multiList-')

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
			options={options?.length > 0 ? options : resources}
			isMulti
			autoFocus={value.length > 0}
			onChange={addValue}
			setShowInput={setShowInput}
			{...props}
		/>
	)

	return (
		<>
			{value.length > 0 && (
				<div className="multi-list__container">
					<Label htmlFor={multiListId} inputValue>
						Zasoby
					</Label>
					<table className="multi-list" id={multiListId}>
						{value.map((option) => (
							<tbody className="multi-list__item" key={option.id}>
								<tr>
									<td>{option.name}</td>

									<td style={{ width: '1px' }}>
										{/* Delete btn */}
										<Button
											type="button"
											rounded
											onClick={() =>
												removeValue(option.id)
											}
											data-tip="Usuń zasób"
											data-for={`removeResourceBtnTip-${option.id}`}
										>
											<FiTrash2 size="20" />
										</Button>

										<ReactTooltip
											id={`removeResourceBtnTip-${option.id}`}
											effect="solid"
											place="right"
											delayShow={250}
										/>
									</td>
								</tr>
							</tbody>
						))}
					</table>
				</div>
			)}
			{showInput && value.length !== resources.length ? (
				value.length > 0 ? (
					input
				) : (
					<FormControl>
						<Label htmlFor={dropdownId}>Zasoby</Label>

						{input}
					</FormControl>
				)
			) : value.length > 0 ? (
				value.length !== resources.length && (
					<Button
						type="button"
						secondary
						small
						onClick={() => setShowInput(true)}
					>
						Dodaj zasób
					</Button>
				)
			) : null}
		</>
	)
}

ResourcesInput.prototype.propTypes = {
	value: PropTypes.any.isRequired,
	resources: PropTypes.array,
	options: PropTypes.array,
	addValue: PropTypes.func.isRequired,
	removeValue: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	resources: state.data.business.resources,
})

export default connect(mapStateToProps, null)(ResourcesInput)
