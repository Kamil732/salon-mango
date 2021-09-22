import React from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'

function AcceptTerms({ onChange, accept_terms }) {
	return (
		<>
			<div className="title">
				<h2>Ochrona Twoich danych</h2>
				<p>
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
						onChange={onChange}
					/>
				</CheckBox.Label>
			</FormControl>
		</>
	)
}

AcceptTerms.prototype.propTypes = {
	onChange: PropTypes.func.isRequired,
	accept_terms: PropTypes.bool,
}

export default AcceptTerms
