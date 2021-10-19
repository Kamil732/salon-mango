import React, { lazy, useEffect, useRef, useState, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { baseRouteUrl, baseUrl } from '../../../app/Routes'

import {
	connectNotificationWS,
	getNotifications,
	getUnreadNotificationsAmount,
	markNotificationAsRead,
} from '../../../redux/actions/data'
import PrivateRoute from '../../../common/PrivateRoute'
import { Link, NavLink, Redirect, Switch } from 'react-router-dom'

import logo from '../../../assets/images/logo.png'
import { BsCalendar, BsLightning, BsPeople } from 'react-icons/bs'
import { CgList } from 'react-icons/cg'
import { VscBell, VscGraph } from 'react-icons/vsc'
import { IoSettingsOutline } from 'react-icons/io5'
import { GoMegaphone } from 'react-icons/go'

import ErrorBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../../layout/loaders/CircleLoader'
import Dashboard from '../../../layout/Dashboard'

const DropdownSelect = lazy(() =>
	import('../../../layout/buttons/dropdowns/DropdownSelect')
)
const Calendar = lazy(() => import('../../../components/business/Calendar'))
const Settings = lazy(() => import('./content/Settings'))
const Services = lazy(() => import('./content/Services'))

const CalendarMenu = lazy(() => import('./menu/CalendarMenu'))
const SettingsMenu = lazy(() => import('./menu/SettingsMenu'))
const ServicesMenu = lazy(() => import('./menu/ServicesMenu'))

function Panel({
	notificationLoading,
	notificationLoaded,
	notifications,
	unReadNotificationsAmount,
	getUnreadNotificationsAmount,
	connectNotificationWS,
	getNotifications,
	markNotificationAsRead,
}) {
	const { t } = useTranslation()
	const [isMenuOpen, toggleMenu] = useState(false)
	const navContainer = useRef(null)

	useEffect(() => {
		const fetch = async () => {
			await getUnreadNotificationsAmount()
			await connectNotificationWS()
		}

		fetch()
	}, [getUnreadNotificationsAmount, connectNotificationWS])

	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflow = 'hidden'

		return () => {
			body.style.overflow = 'auto'
		}
	}, [])

	return (
		<ErrorBoundary>
			<Suspense
				fallback={
					<div className="center-container fullscreen">
						<CircleLoader />
					</div>
				}
			>
				<Dashboard>
					<div ref={navContainer} style={{ display: 'inherit' }}>
						<Dashboard.Nav>
							<Dashboard.NavHeader>
								<Link
									to={
										baseUrl +
										process.env.REACT_APP_PANEL_CALENDAR_URL
									}
								>
									<img
										src={logo}
										width={50}
										height={25}
										alt="Mango"
									/>
								</Link>
								<Dashboard.MenuToggleBtn
									isOpen={isMenuOpen}
									toggleMenu={() => toggleMenu(!isMenuOpen)}
								>
									MENU
								</Dashboard.MenuToggleBtn>
							</Dashboard.NavHeader>
							<hr className="seperator" />
							<Dashboard.NavBody>
								<NavLink
									to={
										baseUrl +
										process.env.REACT_APP_PANEL_CALENDAR_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsCalendar />
									</span>
									{t('panel.calendar')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_PANEL_CUSTOMERS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsPeople />
									</span>
									{t('panel.customers')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_PANEL_STATISTICS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<VscGraph />
									</span>
									{t('panel.statistics')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_PANEL_MARKETING_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsLightning />
									</span>
									{t('panel.marketing')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env.REACT_APP_PANEL_SERVICES_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<CgList />
									</span>
									{t('panel.services')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env.REACT_APP_PANEL_SETTINGS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<IoSettingsOutline />
									</span>
									{t('panel.settings')}
								</NavLink>
							</Dashboard.NavBody>
							<hr className="seperator" />
							<Dashboard.NavFooter>
								<DropdownSelect
									btnContent={<VscBell size={25} />}
									rounded
									aria-label={t('panel.notifications')}
									title={t('panel.notifications')}
									loading={notificationLoading}
									loaded={notificationLoaded}
									loadItems={getNotifications}
									items={notifications}
									unReadItems={unReadNotificationsAmount}
									markRead={markNotificationAsRead}
									noItemsContent={
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'center',
												height: '100%',
											}}
										>
											<GoMegaphone fontSize="100" />
											<h3 style={{ textAlign: 'center' }}>
												{t('panel.no_notifications')}
											</h3>
										</div>
									}
								/>
							</Dashboard.NavFooter>
						</Dashboard.Nav>

						<Dashboard.Menu
							isOpen={isMenuOpen}
							toggleMenu={(state) => toggleMenu(state)}
							navContainer={navContainer}
						>
							<ErrorBoundary>
								<Suspense
									fallback={
										<div className="center-container">
											<CircleLoader />
										</div>
									}
								>
									<Switch>
										<PrivateRoute
											exact
											path={
												baseRouteUrl +
												process.env
													.REACT_APP_PANEL_CALENDAR_URL
											}
											component={CalendarMenu}
										/>
										<PrivateRoute
											exact
											path={
												baseRouteUrl +
												process.env
													.REACT_APP_PANEL_SERVICES_URL
											}
											component={ServicesMenu}
										/>
										<PrivateRoute
											exact
											path={
												baseRouteUrl +
												process.env
													.REACT_APP_PANEL_SETTINGS_URL
											}
											component={SettingsMenu}
										/>
									</Switch>
								</Suspense>
							</ErrorBoundary>
						</Dashboard.Menu>
					</div>

					<Dashboard.Body>
						<ErrorBoundary>
							<Suspense
								fallback={
									<div className="center-container">
										<CircleLoader />
									</div>
								}
							>
								<Switch>
									<PrivateRoute
										exact
										path={
											baseRouteUrl +
											process.env
												.REACT_APP_PANEL_CALENDAR_URL
										}
										component={Calendar}
									/>
									<PrivateRoute
										exact
										path={
											baseRouteUrl +
											process.env
												.REACT_APP_PANEL_SERVICES_URL
										}
										component={Services}
									/>
									<PrivateRoute
										exact
										path={
											baseRouteUrl +
											process.env
												.REACT_APP_PANEL_SETTINGS_URL
										}
										component={Settings}
									/>

									<Redirect
										to={
											baseRouteUrl +
											process.env
												.REACT_APP_PANEL_CALENDAR_URL
										}
									/>
								</Switch>
							</Suspense>
						</ErrorBoundary>
					</Dashboard.Body>
				</Dashboard>
			</Suspense>
		</ErrorBoundary>
	)
}

Panel.prototype.propTypes = {
	ws: PropTypes.object,
	notificationLoading: PropTypes.bool,
	notificationLoaded: PropTypes.bool,
	notifications: PropTypes.array,
	unReadNotificationsAmount: PropTypes.number,
	getUnreadNotificationsAmount: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	markNotificationAsRead: PropTypes.func.isRequired,
	connectNotificationWS: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	ws: state.data.notifications.ws,
	notificationLoading: state.data.notifications.loading,
	notificationLoaded: state.data.notifications.loaded,
	notifications: state.data.notifications.data,
	unReadNotificationsAmount: state.data.notifications.unRead,
})

const mapDispatchToProps = {
	connectNotificationWS,
	getUnreadNotificationsAmount,
	getNotifications,
	markNotificationAsRead,
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel)
