import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { FormControl } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'

function WorkType({
	work_stationary,
	work_remotely,
	onChange,
	componentData,
	changeComponentData,
}) {
	useEffect(() => {
		if (
			!componentData.nextBtnDisabled &&
			!work_stationary &&
			!work_remotely
		)
			changeComponentData({ nextBtnDisabled: true })
		else if (
			componentData.nextBtnDisabled &&
			(work_stationary || work_remotely)
		)
			changeComponentData({ nextBtnDisabled: false })
	}, [
		work_remotely,
		work_stationary,
		componentData.nextBtnDisabled,
		changeComponentData,
	])

	useEffect(() => {
		changeComponentData(
			{
				skip: !work_remotely,
			},
			7
		)
	}, [work_remotely, changeComponentData])

	return (
		<>
			<div className="title-container">
				<h2>W jakim trybie pracujesz</h2>
				<p className="description">
					Pracujesz stacjonarnie czy dajesz usługi mobilne?
				</p>
			</div>

			<FormControl>
				<CheckBox.Label>
					<CheckBox
						name="work_stationary"
						checked={work_stationary}
						onChange={onChange}
						required={
							work_remotely === false && work_stationary === false
						}
					/>
					<p>
						Pracuje stacjonarnie
						<br />
						<small className="text-broken">
							Pracuję stacjonarnie. Prowadzę salon
						</small>
					</p>
				</CheckBox.Label>

				<hr className="seperator lg-space" />

				<CheckBox.Label>
					<CheckBox
						name="work_remotely"
						checked={work_remotely}
						onChange={onChange}
						required={
							work_remotely === false && work_stationary === false
						}
					/>
					<p>
						Świadczę usługi mobilne
						<br />
						<small className="text-broken">
							Oferuję usługi z dojazdem do klienta
						</small>
					</p>
				</CheckBox.Label>

				<hr className="seperator lg-space" />

				{work_remotely === false && work_stationary === false && (
					<div className="center-container">
						<small className="text-broken">
							Wybierz conajmniej jedną opcję
						</small>
					</div>
				)}
			</FormControl>
		</>
	)
}

WorkType.prototype.propTypes = {
	work_stationary: PropTypes.bool,
	work_remotely: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default WorkType
