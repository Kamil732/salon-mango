import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import i18n, { SUPPORTED_LANGUAGES } from './i18n'

import { connect } from 'react-redux'
import CircleLoader from '../layout/loaders/CircleLoader'
import PrivateRoute from '../common/PrivateRoute'
import ErrorBoundary from '../components/ErrorBoundary'

const NotFound = lazy(() => import('../containers/NotFound'))
const Login = lazy(() => import('../containers/auth/Login'))
const Panel = lazy(() => import('../containers/Panel'))

const usersLang = (navigator.language || navigator.userLanguage).split('-')[0]
const baseRouteUrl = '/:locale(en|pl)'
let baseUrl = '/'

if (
	localStorage.getItem('i18nextLng') &&
	SUPPORTED_LANGUAGES.includes(localStorage.getItem('i18nextLng'))
)
	baseUrl += localStorage.getItem('i18nextLng')
else if (usersLang && SUPPORTED_LANGUAGES.includes(usersLang))
	baseUrl += (navigator.language || navigator.userLanguage).split('-')[0]
else baseUrl += 'en'

i18n.on('languageChanged', (lang) => {
	if (SUPPORTED_LANGUAGES.includes(lang)) baseUrl = '/' + lang
})

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

export { baseRouteUrl, baseUrl }
export default connect(mapStateToProps, null)(Routes)
