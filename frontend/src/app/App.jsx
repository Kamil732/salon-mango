import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import '../assets/css/main.css'
import 'react-notifications/lib/notifications.css'
import './locale/i18n'

import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { connect } from 'react-redux'
import { loadUser } from '../redux/actions/auth'

function App({ loadUser }) {
	useEffect(() => loadUser(), [loadUser])

	return (
		<>
			<NotificationContainer />
			<Router>
				<Routes />
			</Router>
		</>
	)
}

App.prototype.propTypes = {
	loadUser: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
	loadUser,
}

export default connect(null, mapDispatchToProps)(App)
