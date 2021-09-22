import React from 'react'
import '../../assets/css/btn-groups.css'

function ButtonContainer(props) {
	return <div className="btn-container" {...props} />
}

function Group({ className, ...props }) {
	className = className ? ` ${className}` : ''

	return <div className={`btn-group-container${className}`} {...props} />
}

ButtonContainer.Group = Group

export default ButtonContainer
