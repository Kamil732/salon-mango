import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { FormControl } from '../../../../layout/forms/Forms'
import CheckBox from '../../../../layout/forms/inputs/CheckBox'

function AcceptTerms({ onChange, accept_terms, changeComponentData }) {
	const { t } = useTranslation()

	return (
		<>
			<div className="title-container">
				<h2>{t('auth.register.accept_terms.title')}</h2>
				<p className="description">
					{t('auth.register.accept_terms.description')}
				</p>
			</div>
			<FormControl>
				<CheckBox.Label>
					{t('auth.register.accept_terms.accept')}
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
							{t('auth.register.accept_terms.warning')}
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
