import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import { connect } from 'react-redux'
import BrickLoader from '../layout/loaders/BrickLoader'
import PageHero from '../layout/PageHero'
import PrivateRoute from '../common/PrivateRoute'

const NotFound = lazy(() => import('../containers/NotFound'))
const Login = lazy(() => import('../containers/auth/Login'))
const Panel = lazy(() => import('../containers/Panel'))

class Routes extends Component {
	static propTypes = {
		loadingCMSData: PropTypes.bool,
	}

	render() {
		const { loadingCMSData } = this.props

		const loader = (
			<PageHero>
				<BrickLoader />
			</PageHero>
		)

		if (loadingCMSData) return loader

		return (
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
		)
	}
}

const mapStateToProps = (state) => ({
	loadingCMSData: state.data.cms.loading,
})

export default connect(mapStateToProps, null)(Routes)
