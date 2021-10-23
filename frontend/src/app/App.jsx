import React, { useEffect } from 'react'
import '../assets/css/main.css'
import 'react-notifications/lib/notifications.css'
import './locale/i18n'

import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { loadUser } from '../redux/actions/auth'

function App() {
	useEffect(() => store.dispatch(loadUser()), [])

	return (
		<Provider store={store}>
			<NotificationContainer />
			<Router>
				<Routes />
			</Router>
		</Provider>
	)
}

export default App
