import React from 'react'
import PropTypes from 'prop-types'

function Card({ formCard, className, ...props }) {
	return (
		<div
			className={`card${formCard ? ' form-card' : ''}${
				className ? ` ${className}` : ''
			}`}
			{...props}
		/>
	)
}

Card.prototype.propTypes = {
	formCard: PropTypes.bool,
}

function Title(props) {
	return <div className="card__title" {...props} />
}

function Body(props) {
	return <div className="card__body" {...props} />
}

Card.Title = Title
Card.Body = Body

export default Card
