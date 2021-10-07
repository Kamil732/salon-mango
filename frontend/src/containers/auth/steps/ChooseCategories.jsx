import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'

const CATEGORIES = require('../../../helpers/data/salon_categories.json')

function ChooseCategories({
	categories,
	onChangeCategory,
	componentData,
	changeComponentData,
}) {
	useEffect(() => {
		if (!componentData.nextBtnDisabled && categories.length === 0)
			changeComponentData({ nextBtnDisabled: true })
		else if (componentData.nextBtnDisabled && categories.length > 0)
			changeComponentData({ nextBtnDisabled: false })
	}, [categories.length, componentData.nextBtnDisabled, changeComponentData])

	return (
		<>
			<div className="title-container">
				<h1>Wybierz kategorię działalności</h1>
			</div>
			<FormControl>
				{CATEGORIES.map(([value, name]) => (
					<div key={value}>
						<CheckBox.Label>
							<CheckBox
								name={value}
								checked={categories.includes(value)}
								onChange={onChangeCategory}
							/>
							{name}
						</CheckBox.Label>

						<hr className="seperator lg-space" />
					</div>
				))}
			</FormControl>
		</>
	)
}

ChooseCategories.prototype.propTypes = {
	categories: PropTypes.object.isRequired,
	onChangeCategory: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default ChooseCategories
