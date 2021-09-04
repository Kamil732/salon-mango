import React from 'react'
import PropTypes from 'prop-types'

import { IoIosArrowForward } from 'react-icons/io'
import CardContainer from '../../../layout/cards/CardContainer'
import Card from '../../../layout/cards/Card'
import FormControl from '../../../layout/forms/FormControl'
import Button from '../../../layout/buttons/Button'

function WorkType({ chooseWorkingType }) {
	return (
		<>
			<div className="title">
				<h2>W jakim trybie pracujesz</h2>
				<p>Pracujesz stacjonarnie czy dajesz usługi mobilne?</p>
			</div>

			<FormControl>
				<CardContainer vertical>
					<Card>
						<Card.Body>
							<div className="space-between">
								<section>
									<header>
										<h4>Tylko stacjonarnie</h4>
									</header>

									<p className="text-broken">
										Pracuję tylko stacjonarnie, Prowadzę
										salon
									</p>
								</section>
								<Button
									rounded
									onClick={() =>
										chooseWorkingType('stationary')
									}
								>
									<IoIosArrowForward size="20" />
								</Button>
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<div className="space-between">
								<section>
									<header>
										<h4>
											Pracuję stacjonarnie i świadczę
											usługi mobilne
										</h4>
									</header>

									<p className="text-broken">
										Pracuję stacjonarnie, ale niektóre
										usługi świadczę również z dojazdem do
										klienta.
									</p>
								</section>
								<Button
									rounded
									onClick={() => chooseWorkingType('both')}
								>
									<IoIosArrowForward size="20" />
								</Button>
							</div>
						</Card.Body>
					</Card>
					<Card>
						<Card.Body>
							<div className="space-between">
								<section>
									<header>
										<h4>Świadczę tylko usługi mobilne</h4>
									</header>

									<p className="text-broken">
										Oferuję jedynie usługi z dojazdem do
										klienta.
									</p>
								</section>
								<Button
									rounded
									onClick={() => chooseWorkingType('mobile')}
								>
									<IoIosArrowForward size="20" />
								</Button>
							</div>
						</Card.Body>
					</Card>
				</CardContainer>
			</FormControl>
		</>
	)
}

WorkType.prototype.propTypes = {
	chooseWorkingType: PropTypes.func.isRequired,
}

export default WorkType
