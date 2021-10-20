import React, { useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../../assets/css/table.css'

import moment from 'moment'
import { IoIosArrowForward } from 'react-icons/io'

import { FormControl } from '../../../../layout/forms/Forms'
import CheckBox from '../../../../layout/forms/inputs/CheckBox'
import Label from '../../../../layout/forms/inputs/Label'
import TimePicker from '../../../../layout/forms/inputs/TimePicker'
import Modal from '../../../../layout/Modal'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function SetWorkingHours({
	onChangeIsWorkingDay,
	updateData,

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
	const { t } = useTranslation()
	const [selected, setSelected] = useState(null)

	const day = (start, end, name, displayName) => {
		const tooltipId = nextId('tooltipId-')

		return (
			<tr>
				<td className="week-day">
					<CheckBox.Label>
						<CheckBox
							name={name}
							onChange={onChangeIsWorkingDay}
							checked={start !== null || end !== null}
						/>
						{displayName}
					</CheckBox.Label>
				</td>
				<td
					className={
						start !== null && end !== null ? ' clickable' : ''
					}
					onClick={() => {
						if (start === null || end === null) return
						setSelected({
							start,
							end,
							name,
							displayName,
						})
					}}
					data-tip={t('auth.register.working_hours.edit')}
					data-for={tooltipId}
				>
					<div className="space-between">
						<span>
							{start === null || end === null ? (
								t('auth.register.working_hours.closed')
							) : (
								<>
									{start} - {end}
								</>
							)}
						</span>
						{start !== null && end !== null && (
							<IoIosArrowForward size="20" />
						)}
					</div>
				</td>
				{start !== null && end !== null && (
					<th style={{ width: '0' }}>
						<ReactTooltip
							id={tooltipId}
							place="right"
							effect="solid"
							type="info"
							delayShow={150}
						/>
					</th>
				)}
			</tr>
		)
	}

	const formatEndWorkTimeLabel = ({ value, label }) => {
		const duration = moment(value, 'HH:mm').diff(
			moment(selected.start, 'HH:mm'),
			'minutes'
		)
		const h = Math.floor(duration / 60)
		const m = Math.round(duration % 60)

		return (
			<>
				<span>{label}</span>
				<br />
				<small className="text-broken">
					{h > 0 && `${h}h `}
					{m > 0 && `${m}m`}
				</small>
			</>
		)
	}

	return (
		<>
			{selected && (
				<Modal closeModal={() => setSelected(null)} isChild small>
					<Modal.Header>
						<h3>{selected.displayName}</h3>
					</Modal.Header>
					<Modal.Body>
						<p className="text-broken">
							{t('auth.register.working_hours.modal.description')}
						</p>
						<FormControl.Inline>
							<Label id="open-hours">
								{t(
									'auth.register.working_hours.modal.open_hours_label'
								)}
							</Label>

							<TimePicker
								name={`start_work_${selected.name}`}
								value={selected.start}
								endLimit={selected.end}
								lessThanEndLimit
								onChange={(val) =>
									setSelected((prev) => ({
										...prev,
										start: val,
									}))
								}
								aria-labelledby="open-hours"
							/>

							<TimePicker
								name={`end_work_${selected.name}`}
								value={selected.end}
								onChange={(val) =>
									setSelected((prev) => ({
										...prev,
										end: val,
									}))
								}
								beginLimit={selected.start}
								moreThanBeginLimit
								formatOptionLabel={formatEndWorkTimeLabel}
								aria-labelledby="open-hours"
							/>
						</FormControl.Inline>

						<ButtonContainer style={{ justifyContent: 'right' }}>
							<Button secondary onClick={() => setSelected(null)}>
								{t('actions.cancel')}
							</Button>
							<Button
								primary
								onClick={() => {
									updateData({
										[`start_work_${selected.name}`]:
											selected.start,
										[`end_work_${selected.name}`]:
											selected.end,
									})
									setSelected(null)
								}}
							>
								{t('actions.save')}
							</Button>
						</ButtonContainer>
					</Modal.Body>
				</Modal>
			)}

			<div className="title-container">
				<h2>{t('auth.register.working_hours.title')}</h2>
				<p className="description">
					{t('auth.register.working_hours.description')}
				</p>
			</div>

			<FormControl>
				<table className="step-table large">
					<tbody>
						{day(
							start_work_monday,
							end_work_monday,
							'monday',
							t('weekdays.monday')
						)}
						{day(
							start_work_tuesday,
							end_work_tuesday,
							'tuesday',
							t('weekdays.tuesday')
						)}
						{day(
							start_work_wednesday,
							end_work_wednesday,
							'wednesday',
							t('weekdays.wednesday')
						)}
						{day(
							start_work_thursday,
							end_work_thursday,
							'thursday',
							t('weekdays.thursday')
						)}
						{day(
							start_work_friday,
							end_work_friday,
							'friday',
							t('weekdays.friday')
						)}
						{day(
							start_work_saturday,
							end_work_saturday,
							'saturday',
							t('weekdays.saturday')
						)}
						{day(
							start_work_sunday,
							end_work_sunday,
							'sunday',
							t('weekdays.sunday')
						)}
					</tbody>
				</table>
			</FormControl>
		</>
	)
}

SetWorkingHours.prototype.propTypes = {
	onChangeIsWorkingDay: PropTypes.func.isRequired,
	updateData: PropTypes.func.isRequired,
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
