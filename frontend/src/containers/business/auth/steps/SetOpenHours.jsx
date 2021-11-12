import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'
import '../../../../assets/css/table.css'

import moment from 'moment'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoIosArrowForward } from 'react-icons/io'
import { FiTrash2 } from 'react-icons/fi'

import { FormControl, FormGroup } from '../../../../layout/forms/Forms'
import CheckBox from '../../../../layout/forms/inputs/CheckBox'
import Label from '../../../../layout/forms/inputs/Label'
import TimePicker from '../../../../layout/forms/inputs/TimePicker'
import Modal from '../../../../layout/Modal'
import ButtonContainer from '../../../../layout/buttons/ButtonContainer'
import Button from '../../../../layout/buttons/Button'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from 'react-i18next'

function SetOpenHours({ setData, open_hours, blocked_hours }) {
	const { t } = useTranslation(['business_register', 'common'])
	const [selected, setSelected] = useState(null)

	const timePickerBlockedHours = useMemo(
		() =>
			selected?.data.blocked_hours.map((blocked_hour) => [
				blocked_hour.start,
				blocked_hour.end,
			]) || null,
		[selected?.data.blocked_hours]
	)

	const toggleWorkDay = (e, weekday) => {
		if (e.target.checked)
			setData((prevData) => ({
				...prevData,
				open_hours: [
					...prevData.open_hours,
					{
						weekday,
						start: '09:00',
						end: '17:00',
					},
				],
			}))
		else
			setData((prevData) => ({
				...prevData,
				open_hours: prevData.open_hours.filter(
					(open_hour) => open_hour.weekday !== weekday
				),
				blocked_hours: prevData.blocked_hours.filter(
					(blocked_hour) => blocked_hour.weekday !== weekday
				),
			}))
	}

	const toggleBlockedHourData = () => {
		if (
			selected.data.blocked_hours.length > 0 &&
			selected.data.blocked_hours[selected.data.blocked_hours.length - 1]
				.start == null &&
			selected.data.blocked_hours[selected.data.blocked_hours.length - 1]
				.end == null
		)
			setSelected((prevData) => ({
				...prevData,
				data: {
					...prevData.data,
					blocked_hours: prevData.data.blocked_hours.slice(
						0,
						prevData.data.blocked_hours.length - 1
					),
				},
			}))
		else
			setSelected((prevData) => ({
				...prevData,
				data: {
					...prevData.data,
					blocked_hours: [
						...prevData.data.blocked_hours,
						{
							id: nextId(),
							weekday: selected.data.weekday,
							start: null,
							end: null,
						},
					],
				},
			}))
	}

	const save = () => {
		const blocked_hours =
			selected.data.blocked_hours.length > 0 &&
			selected.data.blocked_hours[selected.data.blocked_hours.length - 1]
				.start == null &&
			selected.data.blocked_hours[selected.data.blocked_hours.length - 1]
				.end == null
				? selected.data.blocked_hours.slice(
						0,
						selected.data.blocked_hours.length - 1
				  )
				: selected.data.blocked_hours

		setData((prevData) => ({
			...prevData,
			blocked_hours: [
				...prevData.blocked_hours.filter(
					(blocked_hour) =>
						blocked_hour.weekday !== selected.data.weekday
				),
				...blocked_hours,
			],
			open_hours: prevData.open_hours.map((open_hour) => {
				if (open_hour.weekday !== selected.data.weekday)
					return open_hour

				return {
					...open_hour,
					start: selected.data.open_hours.start,
					end: selected.data.open_hours.end,
				}
			}),
		}))
		setSelected(null)
	}

	const onChangeBlockedHours = (val, id, isStartPicker = false) =>
		setSelected((prevData) => ({
			...prevData,
			data: {
				...prevData.data,
				blocked_hours: prevData.data.blocked_hours
					.map((_blocked_hour) => {
						if (_blocked_hour.id === id)
							return {
								..._blocked_hour,
								start: isStartPicker
									? val
									: _blocked_hour.start &&
									  moment(
											_blocked_hour.start,
											'HH:mm'
									  ).isBefore(moment(val, 'HH:mm'))
									? _blocked_hour.start
									: moment(val, 'HH:mm')
											.subtract(5, 'minutes')
											.format('HH:mm'),
								end: !isStartPicker
									? val
									: _blocked_hour.end &&
									  moment(
											_blocked_hour.end,
											'HH:mm'
									  ).isAfter(moment(val, 'HH:mm'))
									? _blocked_hour.end
									: moment(val, 'HH:mm')
											.add(5, 'minutes')
											.format('HH:mm'),
							}

						return _blocked_hour
					})
					.sort((a, b) =>
						moment(b.start, 'HH:mm').isBefore(
							moment(a.start, 'HH:mm')
						)
							? 1
							: -1
					),
			},
		}))

	const deleteBlockedHour = (id) => {
		setSelected((prevData) => ({
			...prevData,
			data: {
				...prevData.data,
				blocked_hours: prevData.data.blocked_hours.filter(
					(blocked_hour) => blocked_hour.id !== id
				),
			},
		}))
	}

	const formatEndWorkTimeLabel = ({ value, label }, start) => {
		const duration = moment(value, 'HH:mm').diff(
			moment(start, 'HH:mm'),
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

	const day = (weekday, displayName) => {
		const tooltipId = nextId('tooltipId-')
		const data = {
			open_hours: open_hours.find(
				(open_hour) => open_hour.weekday === weekday
			),
			blocked_hours: blocked_hours.filter(
				(blocked_hour) => blocked_hour.weekday === weekday
			),
		}

		return (
			<tr>
				<td className="week-day">
					<CheckBox.Label>
						<CheckBox
							name={`weekday-${weekday}`}
							onChange={(e) => toggleWorkDay(e, weekday)}
							checked={data.open_hours != null}
						/>
						{displayName}
					</CheckBox.Label>
				</td>
				<td
					className={data.open_hours != null ? ' clickable' : ''}
					onClick={() => {
						if (data.open_hours == null) return
						setSelected({
							data: {
								weekday,
								...data,
							},
							displayName,
						})
					}}
					data-tip={t('working_hours.edit')}
					data-for={tooltipId}
				>
					<div className="space-between">
						<span>
							{data.open_hours == null ? (
								t('working_hours.closed')
							) : (
								<>
									<span>
										{data.open_hours.start} -{' '}
										{data.open_hours.end}
									</span>
									<p className="text-broken">
										{blocked_hours.map((blocked_hour) => {
											if (
												blocked_hour.weekday !== weekday
											)
												return null

											return (
												<p key={blocked_hour.id}>
													Przerwa:{' '}
													{blocked_hour.start} -{' '}
													{blocked_hour.end}
												</p>
											)
										})}
									</p>
								</>
							)}
						</span>
						{data.open_hours != null && (
							<IoIosArrowForward size="20" />
						)}
					</div>
				</td>
				{data.open_hours != null && (
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

	return (
		<>
			{selected && (
				<Modal closeModal={() => setSelected(null)} isChild small>
					<Modal.Header>
						<h3>{selected.displayName}</h3>
					</Modal.Header>
					<Modal.Body>
						<p className="text-broken">
							{t('working_hours.modal.description')}
						</p>
						<FormControl.Inline>
							<Label id="open-hours">
								{t('working_hours.modal.open_hours_label')}
							</Label>

							<TimePicker
								name={`edit-weekday-${selected.data.weekday}-start`}
								value={selected.data.open_hours.start}
								endLimit={selected.data.open_hours.end}
								lessThanEndLimit
								onChange={(val) =>
									setSelected((prevData) => ({
										...prevData,
										data: {
											...prevData.data,
											open_hours: {
												...prevData.data.open_hours,
												start: val,
											},
										},
									}))
								}
								isNotEditable
								aria-labelledby="open-hours"
							/>

							<TimePicker
								name={`edit-weekday-${selected.data.weekday}-end`}
								value={selected.data.open_hours.end}
								onChange={(val) =>
									setSelected((prevData) => ({
										...prevData,
										data: {
											...prevData.data,
											open_hours: {
												...prevData.data.open_hours,
												end: val,
											},
										},
									}))
								}
								beginLimit={selected.data.open_hours.start}
								moreThanBeginLimit
								formatOptionLabel={(val) =>
									formatEndWorkTimeLabel(
										val,
										selected.data.open_hours.start
									)
								}
								isNotEditable
								aria-labelledby="open-hours"
							/>
						</FormControl.Inline>

						{selected.data.blocked_hours.length > 0 && (
							<FormControl.Inline>
								<Label id="blocked-hours">Przerwy:</Label>

								<div>
									{selected.data.blocked_hours.map(
										(blocked_hour, idx) => (
											<FormGroup key={blocked_hour.id}>
												<FormControl>
													<Label
														htmlFor={`blocked-hours-${blocked_hour.id}-start`}
														inputValue={
															blocked_hour.start
														}
													>
														Start
													</Label>
													<TimePicker
														id={`blocked-hours-${blocked_hour.id}-start`}
														value={
															blocked_hour.start
														}
														onChange={(val) =>
															onChangeBlockedHours(
																val,
																blocked_hour.id,
																true
															)
														}
														step={5}
														beginLimit={
															selected.data
																.blocked_hours[
																idx - 1
															]?.end ||
															selected.data
																.open_hours
																.start
														}
														endLimit={
															selected.data
																.open_hours.end
														}
														moreThanBeginLimit
														startTime
														blockedHours={
															timePickerBlockedHours
														}
														isNotEditable
													/>
												</FormControl>

												<FormControl>
													<Label
														htmlFor={`blocked-hours-${blocked_hour.id}-end`}
														inputValue={
															blocked_hour.end
														}
													>
														End
													</Label>
													<TimePicker
														id={`blocked-hours-${blocked_hour.id}-end`}
														value={blocked_hour.end}
														onChange={(val) =>
															onChangeBlockedHours(
																val,
																blocked_hour.id
															)
														}
														blockedHours={
															timePickerBlockedHours
														}
														step={5}
														beginLimit={
															selected.data
																.open_hours
																.start
														}
														endLimit={
															selected.data
																.blocked_hours[
																idx + 1
															]?.start ||
															selected.data
																.open_hours.end
														}
														lessThanEndLimit
														endTime
														isNotEditable
														formatOptionLabel={(
															val
														) =>
															formatEndWorkTimeLabel(
																val,
																blocked_hour.start
															)
														}
													/>
												</FormControl>

												<Button
													rounded
													onClick={() =>
														deleteBlockedHour(
															blocked_hour.id
														)
													}
												>
													<FiTrash2 size={20} />
												</Button>
											</FormGroup>
										)
									)}
								</div>
							</FormControl.Inline>
						)}

						<Button rounded onClick={toggleBlockedHourData}>
							<AiOutlinePlus
								size="20"
								className="icon-container__icon"
							/>
							Dodaj przerwę
						</Button>
						<hr
							className="seperator full"
							style={{ marginBottom: '2rem' }}
						/>

						<ButtonContainer style={{ justifyContent: 'right' }}>
							<Button secondary onClick={() => setSelected(null)}>
								{t('actions.cancel', { ns: 'common' })}
							</Button>
							<Button primary onClick={save}>
								{t('actions.save', { ns: 'common' })}
							</Button>
						</ButtonContainer>
					</Modal.Body>
				</Modal>
			)}

			<div className="title-container">
				<h2>{t('working_hours.title')}</h2>
				<p className="description">{t('working_hours.description')}</p>
			</div>

			<FormControl>
				<table className="step-table large">
					<tbody>
						{day(1, t('weekdays.monday', { ns: 'common' }))}
						{day(2, t('weekdays.tuesday', { ns: 'common' }))}
						{day(3, t('weekdays.wednesday', { ns: 'common' }))}
						{day(4, t('weekdays.thursday', { ns: 'common' }))}
						{day(5, t('weekdays.friday', { ns: 'common' }))}
						{day(6, t('weekdays.saturday', { ns: 'common' }))}
						{day(0, t('weekdays.sunday', { ns: 'common' }))}
					</tbody>
				</table>
			</FormControl>
		</>
	)
}

SetOpenHours.prototype.propTypes = {
	setData: PropTypes.func.isRequired,
	open_hours: PropTypes.array,
	blocked_hours: PropTypes.array,
}

export default SetOpenHours
