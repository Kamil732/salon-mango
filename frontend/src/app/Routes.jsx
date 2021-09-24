import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import CircleLoader from '../layout/loaders/CircleLoader'
import PrivateRoute from '../common/PrivateRoute'
import ErrorBoundary from '../components/ErrorBoundary'

const NotFound = lazy(() => import('../containers/NotFound'))
const Login = lazy(() => import('../containers/auth/Login'))
const Panel = lazy(() => import('../containers/Panel'))

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
							exact
							path={process.env.REACT_APP_LOGIN_URL}
							component={Login}
						/>
						<PrivateRoute
							path={process.env.REACT_APP_PANEL_URL}
							component={Panel}
						/>

						<Route path="*" component={NotFound} />
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
