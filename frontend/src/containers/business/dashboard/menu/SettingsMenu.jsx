import React from 'react'
import '../../../../assets/css/select-menu.css'
import { useTranslation } from 'react-i18next'

import { RiBarChartHorizontalFill } from 'react-icons/ri'
import {
	FaDatabase,
	FaCalendarAlt,
	FaIdCardAlt,
	FaLayerGroup,
} from 'react-icons/fa'
import { ImUsers } from 'react-icons/im'
import { IoChatbubbles, IoCard } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import { baseUrl } from '../../../../app/locale/location-params'

function CalendarMenu() {
	const { t } = useTranslation('business_panel')

	return (
		<div className="select-menu">
			<NavLink
				to={
					baseUrl +
					process.env
						.REACT_APP_BUSINESS_PANEL_SETTINGS_WORK_SCHEDULE_URL
				}
				className="select-menu__item icon-container"
			>
				<RiBarChartHorizontalFill className="icon-container__icon" />
				{t('menu.work_schedules')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_SALON_DATA_URL
				}
				className="select-menu__item icon-container"
			>
				<FaDatabase className="icon-container__icon" />
				{t('menu.business_data')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_CALENDAR_URL
				}
				className="select-menu__item icon-container"
			>
				<FaCalendarAlt className="icon-container__icon" />
				{t('calendar')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_EMPLOYEES_URL
				}
				className="select-menu__item icon-container"
			>
				<FaIdCardAlt className="icon-container__icon" />
				{t('menu.employees')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_CUSTOMERS_URL
				}
				className="select-menu__item icon-container"
			>
				<ImUsers className="icon-container__icon" />
				{t('customers')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_RESOURCES_URL
				}
				className="select-menu__item icon-container"
			>
				<FaLayerGroup className="icon-container__icon" />
				{t('menu.resources')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_MARKETING_URL
				}
				className="select-menu__item icon-container"
			>
				<IoChatbubbles className="icon-container__icon" />
				{t('marketing')}
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_BUSINESS_PANEL_SETTINGS_PAYMENT_URL
				}
				className="select-menu__item icon-container"
			>
				<IoCard className="icon-container__icon" />
				{t('menu.payment')}
			</NavLink>
		</div>
	)
}

export default CalendarMenu
