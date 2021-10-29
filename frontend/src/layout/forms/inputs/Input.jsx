import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import '../../../assets/css/input.css'

function Input({ errors, ...props }) {
	const { t } = useTranslation('common')

	return (
		<>
			<input
				className={`form-control__input${
					errors?.length > 0 ? ' invalid' : ''
				}`}
				title={props.required ? t('input_title') : ''}
				{...props}
			/>
			{errors?.length > 0 ? (
				<div className="form-control__errors">
					{errors.map((error, idx) => (
						<span key={idx}>{error}</span>
					))}
				</div>
			) : (
				<span className="form-control__input__border"></span>
			)}
		</>
	)
}

Input.prototype.propTypes = {
	errors: PropTypes.array,
}

export default Input
