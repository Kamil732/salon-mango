import React, { useEffect } from 'react'
import 'react-notifications/lib/notifications.css'
import '../assets/css/main.css'

import { BrowserRouter as Router, Switch } from 'react-router-dom'

import Routes from './Routes'
import { NotificationContainer } from 'react-notifications'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { loadUser } from '../redux/actions/auth'

function App() {
	useEffect(() => {
		const getDatas = async () => {
			await store.dispatch(loadUser())
		}

		getDatas()

		// return () => window.location.reload()
	}, [])

	return (
		<Provider store={store}>
			<NotificationContainer />
			<Router>
				<Switch>
					<Routes />
				</Switch>
			</Router>
		</Provider>
	)
}

export default App
