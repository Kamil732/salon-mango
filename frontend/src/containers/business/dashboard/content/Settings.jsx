import React from 'react'
import PrivateRoute from '../../../../common/PrivateRoute'
import { Switch } from 'react-router-dom'

import { baseRouteUrl } from '../../../../app/locale/location-params'

import SettingsIllustration from '../../../../assets/svgs/settings-illustration.svg'
import ErrorBoundary from '../../../../components/ErrorBoundary'

function Settings(props) {
	return (
		<ErrorBoundary>
			<Switch>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_URL
					}
				>
					<div
						style={{
							opacity: '0.6',
							flexDirection: 'column',
							fontSize: '1.7em',
							userSelect: 'none',
							textAlign: 'center',
						}}
						className="center-container"
					>
						<img
							src={SettingsIllustration}
							alt=""
							style={{ width: '60%', marginBottom: '1em' }}
						/>
						Wybierz interesujące cię ustawienie w menu po lewej
						stronie
					</div>
				</PrivateRoute>

				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_WORK_SCHEDULE_URL
					}
				>
					Work schedule
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_SALON_DATA_URL
					}
				>
					Bussines Data
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_CALENDAR_URL
					}
				>
					Calendar
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_EMPLOYEES_URL
					}
				>
					Emplyees
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_CUSTOMERS_URL
					}
				>
					Customers
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_RESOURCES_URL
					}
				>
					Resources
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_MARKETING_URL
					}
				>
					Marketing
				</PrivateRoute>
				<PrivateRoute
					exact
					path={
						baseRouteUrl +
						process.env
							.REACT_APP_BUSINESS_PANEL_SETTINGS_PAYMENT_URL
					}
				>
					Payment
				</PrivateRoute>
			</Switch>
		</ErrorBoundary>
	)
}

export default Settings
