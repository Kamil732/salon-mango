import React, { useState } from 'react'
import PropTypes from 'prop-types'
import nextId from 'react-id-generator'

import { IoIosArrowForward } from 'react-icons/io'

import FormControl from '../../../layout/forms/FormControl'
import FormGroup from '../../../layout/forms/FormGroup'
import Modal from '../../../layout/Modal'
import ButtonContainer from '../../../layout/buttons/ButtonContainer'
import Button from '../../../layout/buttons/Button'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'

function SetWorkingHours({
	onChangeIsWorkingDay,
	setData,

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
	const [selected, setSelected] = useState(null)

	const day = (start, end, name, displayName) => {
		const tooltipId = nextId('tooltipId-')

		return (
			<tr>
				<td
					style={{
						width: '1%',
						whiteSpace: 'nowrap',
					}}
				>
					<FormControl.CheckBoxLabel>
						<FormControl.CheckBox
							name={name}
							onChange={onChangeIsWorkingDay}
							checked={start !== null || end !== null}
						/>
						{displayName}
					</FormControl.CheckBoxLabel>
				</td>
				<td
					className={`space-between${
						start !== null && end !== null ? ' clickable' : ''
					}`}
					onClick={() => {
						if (start === null || end === null) return
						setSelected({
							start,
							end,
							name,
							displayName,
						})
					}}
					data-tip="Kliknij by edytować"
					data-for={tooltipId}
				>
					<span>
						{start === null || end === null ? (
							'Zamknięte'
						) : (
							<>
								{start} - {end}
							</>
						)}
					</span>
					{start !== null && end !== null && (
						<IoIosArrowForward size="20" />
					)}
				</td>
				{start !== null && end !== null && (
					<ReactTooltip
						id={tooltipId}
						place="right"
						effect="solid"
						type="info"
						delayShow={150}
					/>
				)}
			</tr>
		)
	}

	const formatEndWorkTimeLabel = ({ value, label }) => {
		const diff = moment(value, 'HH:mm').diff(
			moment(selected.start, 'HH:mm'),
			'minutes'
		)
		const hours = Math.floor(diff / 60)
		const minutes = Math.round((diff / 60 - hours) * 60)

		return (
			<>
				<span>{label}</span>
				<br />
				<small className="text-broken">
					{hours}h {minutes}min
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
							Ustaw godziny otwarcia Twojego biznesu. Jeśli chcesz
							ustalić godziny dla poszczególnych dni, przejdź do
							kalendarza.
						</p>
						<FormControl.Inline>
							<FormControl.Label id="open-hours">
								Godziny otwarcia
							</FormControl.Label>

							<FormControl.TimePicker
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

							<FormControl.TimePicker
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
								Anuluj
							</Button>
							<Button
								primary
								onClick={() => {
									setData({
										[`start_work_${selected.name}`]:
											selected.start,
										[`end_work_${selected.name}`]:
											selected.end,
									})
									setSelected(null)
								}}
							>
								Zapisz
							</Button>
						</ButtonContainer>
					</Modal.Body>
				</Modal>
			)}

			<div className="title">
				<h2>Godziny otwarcia</h2>
				<p>W jakich godzinach przyjmujesz klientów?</p>
			</div>

			<FormControl>
				<table className="step-table">
					<tbody>
						{day(
							start_work_monday,
							end_work_monday,
							'monday',
							'poniedziałek'
						)}
						{day(
							start_work_tuesday,
							end_work_tuesday,
							'tuesday',
							'wtorek'
						)}
						{day(
							start_work_wednesday,
							end_work_wednesday,
							'wednesday',
							'środa'
						)}
						{day(
							start_work_thursday,
							end_work_thursday,
							'thursday',
							'czwartek'
						)}
						{day(
							start_work_friday,
							end_work_friday,
							'friday',
							'piątek'
						)}
						{day(
							start_work_saturday,
							end_work_saturday,
							'saturday',
							'sobota'
						)}
						{day(
							start_work_sunday,
							end_work_sunday,
							'sunday',
							'niedziela'
						)}
					</tbody>
				</table>
			</FormControl>
		</>
	)
}

SetWorkingHours.prototype.propTypes = {
	onChangeIsWorkingDay: PropTypes.func.isRequired,
	setData: PropTypes.func.isRequired,
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
