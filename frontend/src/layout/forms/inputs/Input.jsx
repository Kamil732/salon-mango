import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import '../../../assets/css/input.css'

function Input({ errors, setErrors, ...props }) {
	const { t } = useTranslation('common')

	const onInvalid = (e) => {
		e.preventDefault()

		if (setErrors)
			setErrors((prevErrors) => ({
				...prevErrors,
				[e.target.name || e.target.id]: [e.target.validationMessage],
			}))
	}

	return (
		<>
			<input
				className={`form-control__input${
					errors?.length > 0 ? ' invalid' : ''
				}`}
				title={props.required ? t('input_title') : ''}
				onInvalid={onInvalid}
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
	setErrors: PropTypes.func,
}

export default Input
