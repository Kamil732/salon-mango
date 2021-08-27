import React, { useEffect } from 'react'

import { RiMenuUnfoldFill } from 'react-icons/ri'

function Dashboard({ children, ...props }) {
	return (
		<div className="dashboard" {...props}>
			{children}
		</div>
	)
}

function Nav({ children, ...props }) {
	return (
		<div className="dashboard__nav" {...props}>
			{children}
		</div>
	)
}

function NavHeader({ children, ...props }) {
	return (
		<div className="dashboard__nav__header" {...props}>
			{children}
		</div>
	)
}

function NavBody({ children, ...props }) {
	return (
		<div className="dashboard__nav__body" {...props}>
			{children}
		</div>
	)
}

function NavFooter({ children, ...props }) {
	return (
		<div className="dashboard__nav__footer" {...props}>
			{children}
		</div>
	)
}

function Menu({ children, navContainer, isOpen, toggleMenu, ...props }) {
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				navContainer.current &&
				!navContainer.current.contains(e.target)
			)
				toggleMenu(false)
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, toggleMenu, navContainer])

	return (
		<div className={`dashboard__menu${isOpen ? ' open' : ''}`} {...props}>
			{children}
		</div>
	)
}

function MenuToggleBtn({ children, isOpen, toggleMenu, ...props }) {
	return (
		<div
			className={`dashboard__btn dashboard__menu-btn${
				isOpen ? ' active' : ''
			}`}
			onClick={() => toggleMenu()}
		>
			<RiMenuUnfoldFill className="dashboard__menu-btn__icon" />
			{children}
		</div>
	)
}

function Body({ children, ...props }) {
	return (
		<div className="dashboard__body" {...props}>
			{children}
		</div>
	)
}

Dashboard.Nav = Nav
Dashboard.NavHeader = NavHeader
Dashboard.NavBody = NavBody
Dashboard.NavFooter = NavFooter
Dashboard.Menu = Menu
Dashboard.MenuToggleBtn = MenuToggleBtn
Dashboard.Body = Body

export default Dashboard
