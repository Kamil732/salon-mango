import React, { lazy, useEffect, useRef, useState, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
	connectNotificationWS,
	getNotifications,
	getUnreadNotificationsAmount,
	markNotificationAsRead,
} from '../redux/actions/data'
import PrivateRoute from '../common/PrivateRoute'
import { Link, NavLink, Redirect, Switch } from 'react-router-dom'

import logo from '../assets/images/logo.png'
import { FaCalendarAlt, FaChartPie, FaListAlt } from 'react-icons/fa'
import { IoChatbubbles, IoSettingsSharp } from 'react-icons/io5'
import { ImUsers } from 'react-icons/im'
import { IoMdNotifications } from 'react-icons/io'
import { GoMegaphone } from 'react-icons/go'

import ErrorBoundary from '../components/ErrorBoundary'
import CircleLoader from '../layout/loaders/CircleLoader'
import Dashboard from '../layout/Dashboard'

const DropdownSelect = lazy(() =>
	import('../layout/buttons/dropdowns/DropdownSelect')
)
const Calendar = lazy(() => import('../components/calendar/Calendar'))
const Settings = lazy(() => import('./dashboard/Settings'))
const Services = lazy(() => import('./dashboard/Services'))

const CalendarMenu = lazy(() => import('./dashboard/menu/CalendarMenu'))
const SettingsMenu = lazy(() => import('./dashboard/menu/SettingsMenu'))
const ServicesMenu = lazy(() => import('./dashboard/menu/ServicesMenu'))

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
										process.env.REACT_APP_PANEL_CALENDAR_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<FaCalendarAlt />
									</span>
									kalendarz
								</NavLink>
								<NavLink
									to={
										process.env
											.REACT_APP_PANEL_CUSTOMERS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<ImUsers />
									</span>
									klienci
								</NavLink>
								<NavLink
									to={
										process.env
											.REACT_APP_PANEL_STATISTICS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<FaChartPie />
									</span>
									statystki
								</NavLink>
								<NavLink
									to={
										process.env
											.REACT_APP_PANEL_COMMUNICATION_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<IoChatbubbles />
									</span>
									łączność
								</NavLink>
								<NavLink
									to={
										process.env.REACT_APP_PANEL_SERVICES_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<FaListAlt />
									</span>
									usługi
								</NavLink>
								<NavLink
									to={
										process.env.REACT_APP_PANEL_SETTINGS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<IoSettingsSharp />
									</span>
									ustawienia
								</NavLink>
							</Dashboard.NavBody>
							<hr className="seperator" />
							<Dashboard.NavFooter>
								<DropdownSelect
									btnContent={<IoMdNotifications size={25} />}
									rounded
									aria-label="Powiadomienia"
									title="Powiadomienia"
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
												Nie masz żadnych powiadomień
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
												process.env
													.REACT_APP_PANEL_CALENDAR_URL
											}
											component={CalendarMenu}
										/>
										<PrivateRoute
											exact
											path={
												process.env
													.REACT_APP_PANEL_SERVICES_URL
											}
											component={ServicesMenu}
										/>
										<PrivateRoute
											exact
											path={
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
											process.env
												.REACT_APP_PANEL_CALENDAR_URL
										}
										component={() => (
											<Calendar isAdminPanel />
										)}
									/>
									<PrivateRoute
										exact
										path={
											process.env
												.REACT_APP_PANEL_SERVICES_URL
										}
										component={Services}
									/>
									<PrivateRoute
										exact
										path={
											process.env
												.REACT_APP_PANEL_SETTINGS_URL
										}
										component={Settings}
									/>

									<Redirect
										to={
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
