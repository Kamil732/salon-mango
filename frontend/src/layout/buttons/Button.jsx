import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function Button({
	children,
	to,
	primary,
	secondary,
	success,
	danger,
	loading,
	disabled,
	small,
	extraSmall,
	rounded,
	loadingText,
	className,
	...props
}) {
	className = className ? className : ''

	if (to) {
		return (
			<Link
				to={to}
				className={`btn${primary ? ' btn__primary' : ''}${
					secondary ? ' btn__secondary' : ''
				}${success ? ' btn__success' : ''}${
					danger ? ' btn__danger' : ''
				}${loading ? ' btn__loading' : ''}${to ? ' btn__link' : ''}${
					small ? ' btn__small' : ''
				}${extraSmall ? ' btn__extraSmall slide-floor' : ''}${
					rounded ? ' btn__rounded' : ''
				} ${className}`}
				disabled={loading || disabled}
				{...props}
			>
				{loading && loadingText ? loadingText : children}
			</Link>
		)
	}

	return (
		<button
			className={`btn${primary ? ' btn__primary' : ''}${
				secondary ? ' btn__secondary' : ''
			}${success ? ' btn__success' : ''}${danger ? ' btn__danger' : ''}${
				loading ? ' btn__loading' : ''
			}${to ? ' btn__link' : ''}${small ? ' btn__small' : ''}${
				extraSmall ? ' btn__extraSmall slide-floor' : ''
			}${rounded ? ' btn__rounded' : ''} ${className}`}
			disabled={loading || disabled}
			{...props}
		>
			{loading && loadingText ? loadingText : children}
		</button>
	)
}

Button.prototype.propTypes = {
	loading: PropTypes.bool,
	loadingText: PropTypes.string,
	disabled: PropTypes.bool,
	primary: PropTypes.bool,
	secondary: PropTypes.bool,
	success: PropTypes.bool,
	danger: PropTypes.bool,
	small: PropTypes.bool,
	extraSmall: PropTypes.bool,
	rounded: PropTypes.bool,
	to: PropTypes.string,
	className: PropTypes.string,
}

function CloseButton({ trCorner, ...props }) {
	return (
		<Button
			rounded
			style={
				trCorner
					? {
							position: 'absolute',
							top: '4px',
							right: '4px',
					  }
					: null
			}
			{...props}
		>
			<span className="btn-close"></span>
		</Button>
	)
}

CloseButton.prototype.propTypes = {
	trCorner: PropTypes.bool,
}

export { CloseButton }
export default Button
