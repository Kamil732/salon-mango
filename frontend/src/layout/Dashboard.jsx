import React from 'react'
import '../assets/css/dashboard.css'

import { RiMenuUnfoldFill } from 'react-icons/ri'
import useClickOutside from '../helpers/hooks/clickOutside'

function Dashboard(props) {
	return <div className="dashboard" {...props} />
}

function Nav(props) {
	return <div className="dashboard__nav" {...props} />
}

function NavHeader(props) {
	return <div className="dashboard__nav__header" {...props} />
}

function NavBody(props) {
	return <div className="dashboard__nav__body" {...props} />
}

function NavFooter(props) {
	return <div className="dashboard__nav__footer" {...props} />
}

function Menu({ navContainer, isOpen, toggleMenu, ...props }) {
	useClickOutside(navContainer, () => toggleMenu(false))

	return (
		<div className={`dashboard__menu${isOpen ? ' open' : ''}`} {...props} />
	)
}

function Body(props) {
	return <div className="dashboard__body" {...props} />
}

function MenuToggleBtn({ children, isOpen, toggleMenu, ...props }) {
	return (
		<div
			className={`dashboard__btn dashboard__menu-btn${
				isOpen ? ' active' : ''
			}`}
			onClick={() => toggleMenu()}
			{...props}
		>
			<RiMenuUnfoldFill className="dashboard__menu-btn__icon" />
			{children}
		</div>
	)
}

Dashboard.NavHeader = NavHeader
Dashboard.NavBody = NavBody
Dashboard.NavFooter = NavFooter
Dashboard.Nav = Nav
Dashboard.MenuToggleBtn = MenuToggleBtn
Dashboard.Menu = Menu
Dashboard.Body = Body

export default Dashboard
