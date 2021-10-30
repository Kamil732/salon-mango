import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import '../../../assets/css/textarea.css'

import TextareaAutosize from 'react-textarea-autosize'

function Textarea({ errors, setErrors, ...props }) {
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
			<TextareaAutosize
				className="form-control__input form-control__textarea"
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

Textarea.prototype.propTypes = {
	errors: PropTypes.array,
	setErrors: PropTypes.func,
}

export default Textarea
