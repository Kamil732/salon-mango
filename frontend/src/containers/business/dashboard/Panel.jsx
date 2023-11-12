import React, { lazy, useEffect, useRef, useState, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { baseRouteUrl, baseUrl } from '../../../app/locale/location-params'
import moment from 'moment'

import {
	connectNotificationWS,
	getNotifications,
	getUnreadNotificationsAmount,
	markNotificationAsRead,
} from '../../../redux/actions/data'
import { logout } from '../../../redux/actions/auth'
import Button from '../../../layout/buttons/Button'
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
import Card from '../../../layout/Card'
import Truncate from 'react-truncate'

const DropdownSelect = lazy(() =>
	import('../../../layout/buttons/dropdowns/DropdownSelect')
)
const Calendar = lazy(() => import('./content/Calendar'))
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
	business,
	user_data,
	getUnreadNotificationsAmount,
	connectNotificationWS,
	getNotifications,
	markNotificationAsRead,
	logout,
}) {
	const { t } = useTranslation(['business_panel', 'auth'])
	const [isMenuOpen, toggleMenu] = useState(window.innerWidth >= 1024)
	const navContainer = useRef(null)

	useEffect(() => {
		const fetch = async () => {
			await getUnreadNotificationsAmount()
			await connectNotificationWS()
		}

		fetch()
	}, [getUnreadNotificationsAmount, connectNotificationWS])

	// useEffect(() => {
	// 	const body = document.querySelector('body')
	// 	body.style.overflow = 'hidden'

	// 	return () => {
	// 		body.style.overflow = 'auto'
	// 	}
	// }, [])

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
										process.env
											.REACT_APP_BUSINESS_PANEL_CALENDAR_URL
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
										process.env
											.REACT_APP_BUSINESS_PANEL_CALENDAR_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsCalendar />
									</span>
									{t('calendar').toLowerCase()}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_BUSINESS_PANEL_CUSTOMERS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsPeople />
									</span>
									{t('customers').toLowerCase()}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_BUSINESS_PANEL_STATISTICS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<VscGraph />
									</span>
									{t('statistics')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_BUSINESS_PANEL_MARKETING_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<BsLightning />
									</span>
									{t('marketing').toLowerCase()}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_BUSINESS_PANEL_SERVICES_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<CgList />
									</span>
									{t('services')}
								</NavLink>
								<NavLink
									to={
										baseUrl +
										process.env
											.REACT_APP_BUSINESS_PANEL_SETTINGS_URL
									}
									className="dashboard__btn"
								>
									<span className="dashboard__btn__icon">
										<IoSettingsOutline />
									</span>
									{t('settings')}
								</NavLink>
							</Dashboard.NavBody>
							<hr className="seperator" />
							<Dashboard.NavFooter>
								<DropdownSelect
									btnContent={<VscBell size={25} />}
									rounded
									aria-label={t('notifications')}
									title={t('notifications')}
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
												{t('no_notifications')}
											</h3>
										</div>
									}
								/>
								<DropdownSelect
									btnContent={
										<img
											src={business.logo}
											width={25}
											height={25}
											className="business_logo"
											alt={business.name}
										/>
									}
									rounded
									aria-label={t('notifications')}
								>
									<Card style={{ height: '100%' }}>
										<Card.Title>
											<h3>{user_data.name}</h3>
											<Button
												primary
												small
												onClick={logout}
											>
												{t('sign_out', { ns: 'auth' })}
											</Button>
										</Card.Title>
										<Card.Body>
											{user_data.businesses.map(
												({ id, name, open_hour }) => {
													// const start = moment(open.start)
													// const end = moment(open.end)
													const now = moment()
													const isOpen =
														now.isAfter(
															moment(
																open_hour.start,
																'HH:mm'
															)
														) &&
														now.isBefore(
															moment(
																open_hour.end,
																'HH:mm'
															)
														)

													return (
														<Card
															key={id}
															style={{
																marginTop:
																	'1rem',
															}}
														>
															<Card.Body>
																<div className="space-between">
																	<Truncate
																		lines={
																			1
																		}
																		width={
																			150
																		}
																	>
																		{name}
																	</Truncate>
																	{isOpen ? (
																		<span className="success">
																			{t(
																				'open'
																			)}
																		</span>
																	) : (
																		<span className="error">
																			{t(
																				'closed'
																			)}
																		</span>
																	)}
																</div>
															</Card.Body>
														</Card>
													)
												}
											)}
										</Card.Body>
									</Card>
								</DropdownSelect>
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
													.REACT_APP_BUSINESS_PANEL_CALENDAR_URL
											}
											component={CalendarMenu}
										/>
										<PrivateRoute
											exact
											path={
												baseRouteUrl +
												process.env
													.REACT_APP_BUSINESS_PANEL_SERVICES_URL
											}
											component={ServicesMenu}
										/>
										<PrivateRoute
											path={
												baseRouteUrl +
												process.env
													.REACT_APP_BUSINESS_PANEL_SETTINGS_URL
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
												.REACT_APP_BUSINESS_PANEL_CALENDAR_URL
										}
										component={Calendar}
									/>
									<PrivateRoute
										exact
										path={
											baseRouteUrl +
											process.env
												.REACT_APP_BUSINESS_PANEL_SERVICES_URL
										}
										component={Services}
									/>
									<PrivateRoute
										path={
											baseRouteUrl +
											process.env
												.REACT_APP_BUSINESS_PANEL_SETTINGS_URL
										}
										component={Settings}
									/>

									<Redirect
										to={
											baseUrl +
											process.env
												.REACT_APP_BUSINESS_PANEL_CALENDAR_URL
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
	notificationLoading: PropTypes.bool,
	notificationLoaded: PropTypes.bool,
	notifications: PropTypes.array,
	unReadNotificationsAmount: PropTypes.number,
	business: PropTypes.object,
	user_data: PropTypes.object,
	getUnreadNotificationsAmount: PropTypes.func.isRequired,
	getNotifications: PropTypes.func.isRequired,
	markNotificationAsRead: PropTypes.func.isRequired,
	connectNotificationWS: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	notificationLoading: state.data.notifications.loading,
	notificationLoaded: state.data.notifications.loaded,
	notifications: state.data.notifications.data,
	unReadNotificationsAmount: state.data.notifications.unRead,
	business: state.data.business.data,
	user_data: state.auth.data,
})

const mapDispatchToProps = {
	connectNotificationWS,
	getUnreadNotificationsAmount,
	getNotifications,
	markNotificationAsRead,
	logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel)
