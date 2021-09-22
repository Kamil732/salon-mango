import React from 'react'
import '../../assets/css/spinner.css'

function CircleLoader(props) {
	return (
		<div className="circle-loader" {...props}>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
			<div className="circle-loader__item"></div>
		</div>
	)
}

export default CircleLoader
