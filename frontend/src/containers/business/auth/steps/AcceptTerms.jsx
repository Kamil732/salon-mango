import React from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../../layout/forms/Forms'
import CheckBox from '../../../../layout/forms/inputs/CheckBox'

function AcceptTerms({ onChange, accept_terms, changeComponentData }) {
	return (
		<>
			<div className="title-container">
				<h2>Ochrona Twoich danych</h2>
				<p className="description">
					Dzięki rozporządzeniu o ochronie danych osobowych (RODO), to
					Ty zarządzasz swoimi danymi. Powiedz nam, w jakim zakresie
					możemy przetwarzać Twoje dane.
				</p>
			</div>
			<FormControl>
				<CheckBox.Label>
					Akceptuje regulamin
					<CheckBox
						name="accept_terms"
						checked={accept_terms}
						onChange={(e) => {
							onChange(e)
							changeComponentData({
								nextBtnDisabled: !e.target.checked,
							})
						}}
					/>
				</CheckBox.Label>
			</FormControl>
			{!accept_terms && (
				<>
					<hr className="seperator" />
					<div className="center-container">
						<small className="text-broken">
							Musisz zakceptować regulamin, aby przejść dalej
						</small>
					</div>
				</>
			)}
		</>
	)
}

AcceptTerms.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	accept_terms: PropTypes.bool,
	changeComponentData: PropTypes.func.isRequired,
}

export default AcceptTerms
