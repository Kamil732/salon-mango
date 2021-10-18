import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import getHeaders from '../../../helpers/getHeaders'

import { FormControl } from '../../../layout/forms/Forms'
import CheckBox from '../../../layout/forms/inputs/CheckBox'
import CircleLoader from '../../../layout/loaders/CircleLoader'

function ChooseCategories({
	categories,
	onChangeCategory,
	componentData,
	changeComponentData,
}) {
	const [categoriesFetchData, setCategoriesFetchData] = useState({
		isLoading: true,
		error: null,
		data: [],
	})

	useEffect(() => {
		setCategoriesFetchData((prevData) => ({
			...prevData,
			isLoading: true,
		}))

		axios
			.get(
				`${process.env.REACT_APP_API_URL}/data/salon-categories/`,
				getHeaders()
			)
			.then((categoriesData) =>
				setCategoriesFetchData((prevData) => ({
					...prevData,
					isLoading: false,
					error: null,
					data: categoriesData.data,
				}))
			)
			.catch((error) => {
				setCategoriesFetchData((prevData) => ({
					...prevData,
					isLoading: false,
					error,
				}))
			})
	}, [])

	useEffect(() => {
		if (!componentData.nextBtnDisabled && categories.length === 0)
			changeComponentData({ nextBtnDisabled: true })
		else if (componentData.nextBtnDisabled && categories.length > 0)
			changeComponentData({ nextBtnDisabled: false })
	}, [categories.length, componentData.nextBtnDisabled, changeComponentData])

	return (
		<>
			<div className="title-container">
				<h1>Wybierz kategorię działalności</h1>
			</div>
			{categoriesFetchData.isLoading ? (
				<div className="center-container">
					<CircleLoader />
				</div>
			) : categoriesFetchData.error == null ? (
				<FormControl>
					{categoriesFetchData.data.map(({ name, slug }) => (
						<div key={slug}>
							<CheckBox.Label>
								<CheckBox
									name={slug}
									checked={categories.includes(slug)}
									onChange={onChangeCategory}
								/>
								{name}
							</CheckBox.Label>

							<hr className="seperator lg-space" />
						</div>
					))}
				</FormControl>
			) : (
				<div className="center-container">
					<h3>
						Wystąpił błąd podczas pobierania danych. Spróbuj
						ponownie później.
					</h3>
				</div>
			)}
		</>
	)
}

ChooseCategories.prototype.propTypes = {
	categories: PropTypes.object.isRequired,
	onChangeCategory: PropTypes.func.isRequired,
	componentData: PropTypes.object.isRequired,
	changeComponentData: PropTypes.func.isRequired,
}

export default ChooseCategories
