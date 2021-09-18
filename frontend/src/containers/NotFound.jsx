import React from 'react'

import { ReactComponent as Error404Illustration } from '../assets/svgs/error-404-illustration.svg'

function NotFound() {
	return (
		<div className="page-hero vertical">
			<div className="page-hero__img-container">
				<Error404Illustration className="page-hero__img" />
			</div>
			<div className="page-hero__text">
				Nie ma takiej strony. Użyj nawigacji na górze strony by dostać
				się tam gdzie chcesz.
			</div>
		</div>
	)
}

export default NotFound
