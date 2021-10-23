import React, { lazy } from 'react'
import { Route, Switch } from 'react-router'
import { baseRouteUrl } from '../../app/locale/location-params'

import NotFound from '../NotFound'
const Index = lazy(() => import('./Index'))

function Routes() {
	return (
		<Switch>
			<Route exact path={baseRouteUrl} component={Index} />

			<Route path="*" component={NotFound} />
		</Switch>
	)
}

export default Routes
