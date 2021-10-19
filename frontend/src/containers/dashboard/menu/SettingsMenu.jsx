import React from 'react'
import '../../../assets/css/select-menu.css'

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
import { baseUrl } from '../../../app/Routes'

function CalendarMenu() {
	return (
		<div className="select-menu">
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_PANEL_SETTINGS_WORK_SCHEDULE_URL
				}
				className="select-menu__item icon-container"
			>
				<RiBarChartHorizontalFill className="icon-container__icon" />
				Grafiki pracy
			</NavLink>
			<NavLink
				to={
					baseUrl +
					process.env.REACT_APP_PANEL_SETTINGS_SALON_DATA_URL
				}
				className="select-menu__item icon-container"
			>
				<FaDatabase className="icon-container__icon" />
				Dane solonu
			</NavLink>
			<NavLink
				to={baseUrl + process.env.REACT_APP_PANEL_SETTINGS_CALENDAR_URL}
				className="select-menu__item icon-container"
			>
				<FaCalendarAlt className="icon-container__icon" />
				Kalendarz
			</NavLink>
			<NavLink
				to={
					baseUrl + process.env.REACT_APP_PANEL_SETTINGS_EMPLOYEES_URL
				}
				className="select-menu__item icon-container"
			>
				<FaIdCardAlt className="icon-container__icon" />
				Pracownicy
			</NavLink>
			<NavLink
				to={
					baseUrl + process.env.REACT_APP_PANEL_SETTINGS_CUSTOMERS_URL
				}
				className="select-menu__item icon-container"
			>
				<ImUsers className="icon-container__icon" />
				Klienci
			</NavLink>
			<NavLink
				to={
					baseUrl + process.env.REACT_APP_PANEL_SETTINGS_RESOURCES_URL
				}
				className="select-menu__item icon-container"
			>
				<FaLayerGroup className="icon-container__icon" />
				Zasoby
			</NavLink>
			<NavLink
				to={
					baseUrl + process.env.REACT_APP_PANEL_SETTINGS_MARKETING_URL
				}
				className="select-menu__item icon-container"
			>
				<IoChatbubbles className="icon-container__icon" />
				Komunikacja
			</NavLink>
			<NavLink
				to={baseUrl + process.env.REACT_APP_PANEL_SETTINGS_PAYMENT_URL}
				className="select-menu__item icon-container"
			>
				<IoCard className="icon-container__icon" />
				Płatności
			</NavLink>
		</div>
	)
}

export default CalendarMenu
