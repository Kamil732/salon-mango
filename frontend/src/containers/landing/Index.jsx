import React from 'react'
import { baseUrl } from '../../app/Routes'
import Button from '../../layout/buttons/Button'

function Index() {
	return (
		<div>
			<h1>Landing Page</h1>
			<Button to={baseUrl + process.env.REACT_APP_BUSINESS_URL} primary>
				For salons
			</Button>
		</div>
	)
}

export default Index
