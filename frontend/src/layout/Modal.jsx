import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import '../assets/css/modal.css'

import useClickOutside from '../helpers/hooks/clickOutside'
import { CloseButton } from './buttons/Button'

function Modal({ children, closeModal, isChild, small, fullscreen, ...props }) {
	const modalRef = useRef(null)
	useClickOutside(modalRef, closeModal)

	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflowY = 'hidden'

		return () => {
			if (!isChild) body.style.overflowY = 'auto'
		}
	}, [isChild])

	const modal = (
		<div className="dark-bg">
			<div
				className={`modal${small ? ' small' : ''}${
					fullscreen ? ' fullscreen' : ''
				}`}
				{...props}
				ref={modalRef}
			>
				<CloseButton trCorner onClick={closeModal} />
				{children}
			</div>
		</div>
	)

	if (isChild) return modal

	return createPortal(modal, document.querySelector('body'))
}

function Header(props) {
	return <div className="modal__header" {...props} />
}

function Body(props) {
	return <div className="modal__body" {...props} />
}

Modal.prototype.propTypes = {
	isChild: PropTypes.bool,
	small: PropTypes.bool,
	fullscreen: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
}

Modal.Header = Header
Modal.Body = Body

export default Modal
