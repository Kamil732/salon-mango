import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { baseUrl } from '../app/location-params'

class PrivateRoute extends Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool,
		userLoading: PropTypes.bool,
	}

	render() {
		if (this.props.userLoading !== false) return <></>
		else if (!this.props.userLoading && !this.props.isAuthenticated) {
			return (
				<Redirect
					to={baseUrl + process.env.REACT_APP_BUSINESS_LOGIN_URL}
				/>
			)
		}

		return <Route {...this.props}>{this.props.children}</Route>
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	userLoading: state.auth.loading,
})

export default connect(mapStateToProps, null)(PrivateRoute)
