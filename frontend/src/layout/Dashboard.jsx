import React from 'react'
import '../assets/css/dashboard.css'

import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'
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
	useClickOutside(navContainer, () => {
		if (window.innerWidth < 1024) toggleMenu(false)
	})

	if (!isOpen) return null

	return <div className="dashboard__menu" {...props} />
}

function Body(props) {
	return <div className="dashboard__body" {...props} />
}

function MenuToggleBtn({ children, isOpen, toggleMenu, ...props }) {
	return (
		<div
			className="dashboard__btn dashboard__menu-btn"
			onClick={() => toggleMenu()}
			{...props}
		>
			{isOpen ? (
				<RiMenuFoldLine className="dashboard__menu-btn__icon" />
			) : (
				<RiMenuUnfoldLine className="dashboard__menu-btn__icon" />
			)}
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
