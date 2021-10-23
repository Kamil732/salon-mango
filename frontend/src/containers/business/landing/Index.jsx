import React from 'react'
import { baseUrl } from '../../../app/locale/location-params'
import Button from '../../../layout/buttons/Button'

function Index() {
	return (
		<div>
			<h1>Business Landing Page</h1>
			<Button
				to={baseUrl + process.env.REACT_APP_BUSINESS_LOGIN_URL}
				primary
			>
				Login
			</Button>
		</div>
	)
}

export default Index
