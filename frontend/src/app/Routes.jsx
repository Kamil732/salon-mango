import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import CircleLoader from '../layout/loaders/CircleLoader'
import PrivateRoute from '../common/PrivateRoute'
import ErrorBoundary from '../components/ErrorBoundary'

const NotFound = lazy(() => import('../containers/NotFound'))
const Login = lazy(() => import('../containers/auth/Login'))
const Panel = lazy(() => import('../containers/Panel'))

export const baseRouteUrl = '/:locale(en|pl)?'
export const baseUrl =
	'/' +
	(localStorage.getItem('i18nextLng') ||
		(navigator.language || navigator.userLanguage).split('-')[0] ||
		'en')

class Routes extends Component {
	static propTypes = {
		loadingSalon: PropTypes.bool,
	}

	render() {
		const { loadingSalon } = this.props

		const loader = (
			<div className="center-container fullscreen">
				<CircleLoader />
			</div>
		)

		if (loadingSalon) return loader

		return (
			<ErrorBoundary>
				<Suspense fallback={loader}>
					<Switch>
						<Route
							path="/"
							exact
							render={() => <Redirect to={baseUrl} />}
						/>
						<Route
							exact
							path={
								baseRouteUrl + process.env.REACT_APP_LOGIN_URL
							}
							component={Login}
						/>
						<PrivateRoute
							path={
								baseRouteUrl + process.env.REACT_APP_PANEL_URL
							}
							component={Panel}
						/>
						<Route path="*" component={NotFound} />
						{/* </Route>
						<Redirect to={baseUrl} /> */}
					</Switch>
				</Suspense>
			</ErrorBoundary>
		)
	}
}

const mapStateToProps = (state) => ({
	loadingSalon:
		state.auth.isAuthenticated &&
		Object.keys(state.data.salon).length === 0,
})

export default connect(mapStateToProps, null)(Routes)
