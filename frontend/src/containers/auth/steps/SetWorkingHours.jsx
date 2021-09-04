import React from 'react'
import PropTypes from 'prop-types'

import { IoIosArrowForward } from 'react-icons/io'
import FormControl from '../../../layout/forms/FormControl'

function SetWorkingHours({
	onChangeIsWorkingDay,
	start_work_monday,
	end_work_monday,
	start_work_tuesday,
	end_work_tuesday,
	start_work_wednesday,
	end_work_wednesday,
	start_work_thursday,
	end_work_thursday,
	start_work_friday,
	end_work_friday,
	start_work_saturday,
	end_work_saturday,
	start_work_sunday,
	end_work_sunday,
}) {
	return (
		<FormControl>
			<table className="step-table">
				<tbody>
					<tr>
						<td
							style={{
								width: '1%',
								whiteSpace: 'nowrap',
							}}
						>
							<FormControl.CheckBoxLabel>
								<FormControl.CheckBox
									name="monday"
									onChange={onChangeIsWorkingDay}
									checked={
										start_work_monday !== null ||
										end_work_monday !== null
									}
								/>
								poniedziałek
							</FormControl.CheckBoxLabel>
						</td>
						<td className="space-between">
							<span>
								{start_work_monday === null ||
								end_work_monday === null ? (
									'Zamknięte'
								) : (
									<>
										{start_work_monday} -{end_work_monday}
									</>
								)}
							</span>
							<IoIosArrowForward size="20" />
						</td>
					</tr>
					<tr>
						<td>
							<FormControl.CheckBoxLabel>
								<FormControl.CheckBox
									name="tuesday"
									onChange={onChangeIsWorkingDay}
									checked={
										start_work_tuesday !== null ||
										end_work_tuesday !== null
									}
								/>
								wtorek
							</FormControl.CheckBoxLabel>
						</td>
						<td className="space-between">
							<span>
								{start_work_tuesday === null ||
								end_work_tuesday === null ? (
									'Zamknięte'
								) : (
									<>
										{start_work_tuesday} -{' '}
										{end_work_tuesday}
									</>
								)}
							</span>
							<IoIosArrowForward size="20" />
						</td>
					</tr>
					<tr>
						<td>
							<FormControl.CheckBoxLabel>
								<FormControl.CheckBox
									name="sunday"
									onChange={onChangeIsWorkingDay}
									checked={
										start_work_sunday !== null ||
										end_work_sunday !== null
									}
								/>
								niedziela
							</FormControl.CheckBoxLabel>
						</td>
						<td className="space-between">
							<span>
								{start_work_sunday === null ||
								end_work_sunday === null ? (
									'Zamknięte'
								) : (
									<>
										{start_work_sunday} - {end_work_sunday}
									</>
								)}
							</span>
							<IoIosArrowForward size="20" />
						</td>
					</tr>
				</tbody>
			</table>
		</FormControl>
	)
}

SetWorkingHours.prototype.propTypes = {
	onChangeIsWorkingDay: PropTypes.func.isRequired,
	start_work_monday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_monday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_tuesday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_tuesday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_wednesday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_wednesday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_thursday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_thursday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_friday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_friday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_saturday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_saturday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	start_work_sunday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
	end_work_sunday: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(null),
	]),
}

export default SetWorkingHours
