import React from 'react'
import PropTypes from 'prop-types'

import FormControl from '../../../layout/forms/FormControl'

function WorkType({ work_stationary, work_remotely, onChange }) {
	return (
		<>
			<div className="title">
				<h2>W jakim trybie pracujesz</h2>
				<p>Pracujesz stacjonarnie czy dajesz usługi mobilne?</p>
			</div>

			<FormControl>
				<FormControl.CheckBoxLabel>
					<FormControl.CheckBox
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
				</FormControl.CheckBoxLabel>

				<hr className="seperator lg-space" />

				<FormControl.CheckBoxLabel>
					<FormControl.CheckBox
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
				</FormControl.CheckBoxLabel>

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
}

export default WorkType
