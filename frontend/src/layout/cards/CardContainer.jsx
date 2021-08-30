import React from 'react'

function CardContainer({ vertical, ...props }) {
	return (
		<div
			className={`card-container${vertical ? ' vertical' : ''}`}
			{...props}
		/>
	)
}

export default CardContainer
