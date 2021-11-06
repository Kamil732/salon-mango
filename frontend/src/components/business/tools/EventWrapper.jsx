import React from 'react'

import { useId } from 'react-id-generator'

import ReactTooltip from 'react-tooltip'
import getEventTooltip from '../../../helpers/getEventTooltip'

function EventWrapper({ event, children }) {
	const [id] = useId(1, 'eventTip-')

	return (
		<>
			<div data-tip data-for={id}>
				{children}
			</div>
			<ReactTooltip
				id={id}
				place="right"
				type="light"
				borderColor="grey"
				border
				offset={{ right: 20 }}
				delayShow={250}
				getContent={() => getEventTooltip(event)}
			/>
		</>
	)
}

export default EventWrapper
