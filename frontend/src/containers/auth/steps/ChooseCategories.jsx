import React from 'react'
import PropTypes from 'prop-types'

import FormControl from '../../../layout/forms/FormControl'

function ChooseCategories({ categories, onChangeCategory }) {
	return (
		<>
			<div className="title">
				<h1>Wybierz kategorię działalności</h1>
			</div>
			<FormControl>
				{Object.keys(categories).map((key) => (
					<div key={key}>
						<FormControl.CheckBoxLabel key={key}>
							<FormControl.CheckBox
								name={key}
								checked={categories[key].checked}
								onChange={onChangeCategory}
							/>
							{categories[key].name}
						</FormControl.CheckBoxLabel>

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
}

export default ChooseCategories
