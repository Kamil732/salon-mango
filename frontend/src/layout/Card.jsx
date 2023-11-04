import React from 'react'
import PropTypes from 'prop-types'
import '../assets/css/card.css'

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

function Header(props) {
	return <div className="card__header" {...props} />
}

function Body(props) {
	return <div className="card__body" {...props} />
}

function CardContainer({ vertical, ...props }) {
	return (
		<div
			className={`card-container${vertical ? ' vertical' : ''}`}
			{...props}
		/>
	)
}

Card.Title = Title
Card.Header = Header
Card.Body = Body

export { CardContainer }
export default Card
