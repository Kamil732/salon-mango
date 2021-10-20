import React, { lazy } from 'react'
import { Route, Switch } from 'react-router'
import { baseRouteUrl } from '../../app/Routes'

import PrivateRoute from '../../common/PrivateRoute'
import NotFound from '../NotFound'

const Login = lazy(() => import('./auth/Login'))
const Panel = lazy(() => import('./dashboard/Panel'))
const Index = lazy(() => import('./landing/Index'))

function Routes() {
	return (
		<Switch>
			<Route
				exact
				path={baseRouteUrl + process.env.REACT_APP_BUSINESS_LOGIN_URL}
				component={Login}
			/>
			<PrivateRoute
				path={baseRouteUrl + process.env.REACT_APP_BUSINESS_PANEL_URL}
				component={Panel}
			/>

			<Route
				exact
				path={baseRouteUrl + process.env.REACT_APP_BUSINESS_URL}
				component={Index}
			/>

			<Route path="*" component={NotFound} />
		</Switch>
	)
}

export default Routes
