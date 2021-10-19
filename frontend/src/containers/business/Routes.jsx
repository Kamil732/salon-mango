import React, { lazy } from 'react'
import { Route, Switch } from 'react-router'
import { baseRouteUrl } from '../../app/Routes'
import PrivateRoute from '../../common/PrivateRoute'

const Login = lazy(() => import('./auth/Login'))
const Panel = lazy(() => import('./dashboard/Panel'))

function Routes() {
	return (
		<Switch>
			<Route
				exact
				path={baseRouteUrl + process.env.REACT_APP_LOGIN_URL}
				component={Login}
			/>
			<PrivateRoute
				path={baseRouteUrl + process.env.REACT_APP_PANEL_URL}
				component={Panel}
			/>
		</Switch>
	)
}

export default Routes
