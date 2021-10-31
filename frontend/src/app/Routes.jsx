import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'

import { baseRouteUrl, baseUrl } from './locale/location-params'
import { connect } from 'react-redux'

import CircleLoader from '../layout/loaders/CircleLoader'
import ErrorBoundary from '../components/ErrorBoundary'

const LandingPageRoutes = lazy(() => import('../containers/landing/Routes'))
const BusinessRoutes = lazy(() => import('../containers/business/Routes'))

class Routes extends Component {
	static propTypes = {
		loadingBusiness: PropTypes.bool,
	}

	render() {
		const { loadingBusiness } = this.props

		const loader = (
			<div className="center-container fullscreen">
				<CircleLoader />
			</div>
		)

		if (loadingBusiness) return loader

		return (
			<ErrorBoundary>
				<Suspense fallback={loader}>
					<Switch>
						<Route
							path={
								baseRouteUrl +
								process.env.REACT_APP_BUSINESS_URL
							}
							component={BusinessRoutes}
						/>
						<Route
							path={baseRouteUrl}
							component={LandingPageRoutes}
						/>
						<Redirect to={baseUrl} />
					</Switch>
				</Suspense>
			</ErrorBoundary>
		)
	}
}

const mapStateToProps = (state) => ({
	loadingBusiness: state.data.business.loading,
})

export default connect(mapStateToProps, null)(Routes)
