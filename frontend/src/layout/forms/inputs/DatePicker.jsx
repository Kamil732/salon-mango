import React, { lazy, Suspense, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import '../../../assets/css/calendar-picker.css'

import useClickOutside from '../../../helpers/hooks/clickOutside'
import moment from 'moment'

import ErrorBoundary from '../../../components/ErrorBoundary'
import CircleLoader from '../../loaders/CircleLoader'

import Input from './Input'
const DatePickerCalendar = lazy(() => import('react-calendar'))

function DatePicker({ value, onChange, minDate, maxDate, ...props }) {
	const [isOpen, setIsOpen] = useState(false)
	const container = useRef(null)
	useClickOutside(container, () => setIsOpen(false))
	const formatShortWeekday = (_, date) => moment(date).format('dd')

	return (
		<div ref={container}>
			<Input
				value={moment(value).format('YYYY-MM-DD')}
				onFocus={() => setIsOpen(true)}
				readOnly
				{...props}
			/>

			{isOpen && (
				<div className="dropdown-options">
					<ErrorBoundary>
						<Suspense
							fallback={
								<div className="center-container">
									<CircleLoader />
								</div>
							}
						>
							<DatePickerCalendar
								onChange={onChange}
								value={value}
								locale="pl-PL"
								next2Label={null}
								prev2Label={null}
								minDetail="year"
								maxDetail="month"
								onClickDay={() =>
									setTimeout(() => setIsOpen(false), 0)
								}
								minDate={minDate}
								maxDate={maxDate}
								formatShortWeekday={formatShortWeekday}
							/>
						</Suspense>
					</ErrorBoundary>
				</div>
			)}
		</div>
	)
}

DatePicker.prototype.propTypes = {
	value: PropTypes.instanceOf(Date).isRequired,
	onChange: PropTypes.func.isRequired,
	minDate: PropTypes.instanceOf(Date),
	maxDate: PropTypes.instanceOf(Date),
}

export default DatePicker
