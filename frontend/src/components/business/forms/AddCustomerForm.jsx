import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'

import { addCustomer } from '../../../redux/actions/data'
import { MdSwapHoriz } from 'react-icons/md'
import getHeaders from '../../../helpers/getHeaders'
import { country } from '../../../app/locale/location-params'

import { FormControl, FormGroup } from '../../../layout/forms/Forms'
import Input from '../../../layout/forms/inputs/Input'
import Label from '../../../layout/forms/inputs/Label'
import PhoneNumberInput from '../../../layout/forms/inputs/PhoneNumberInput'

import Button from '../../../layout/buttons/Button'
import ReactTooltip from 'react-tooltip'
import { NotificationManager } from 'react-notifications'

const countries = require('../../../assets/data/countries.json')

class AddCustomerForm extends Component {
	static propTypes = {
		business_id: PropTypes.number.isRequired,
		setCustomer: PropTypes.func.isRequired,
		addCustomer: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,

			first_name: '',
			last_name: '',
			phone_prefix: countries.find(
				({ isoCode }) => isoCode.toLowerCase() === country
			),
			phone_number: '',
			fax_number: '',
		}

		this.swapNames = this.swapNames.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	swapNames = () =>
		this.setState((state) => ({
			first_name: state.last_name,
			last_name: state.first_name,
		}))

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()
		const { business_id } = this.props
		const {
			first_name,
			last_name,
			phone_prefix,
			phone_number,
			fax_number,
		} = this.state

		this.setState({ loading: true })

		try {
			const body = JSON.stringify({
				first_name,
				last_name,
				phone_number: phone_prefix.dialCode + phone_number,
				fax_number: fax_number
					? phone_prefix.dialCode + fax_number
					: '',
			})

			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/data/businesses/${business_id}/customers/`,
				body,
				getHeaders(true)
			)

			this.props.setCustomer(res.data)
			this.props.addCustomer(res.data)

			NotificationManager.success('Utworzono nowego klienta')
		} catch {
			NotificationManager.error('Nie udało się zapisać klienta')
		} finally {
			this.setState({ loading: false })
		}
	}

	render() {
		const {
			loading,
			first_name,
			last_name,
			phone_prefix,
			phone_number,
			fax_number,
		} = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<FormGroup>
					<FormControl>
						<Label htmlFor="first_name" inputValue={first_name}>
							Imię
						</Label>
						<Input
							required
							id="first_name"
							name="first_name"
							value={first_name}
							onChange={this.onChange}
						/>
					</FormControl>

					<Button
						type="button"
						rounded
						onClick={this.swapNames}
						data-tip="Zamień imię z nazwiskiem"
						data-for="swapNamesTip"
					>
						<MdSwapHoriz size="25" />
					</Button>
					<ReactTooltip
						type="dark"
						id="swapNamesTip"
						place="top"
						effect="solid"
						delayShow={250}
					/>

					<FormControl>
						<Label htmlFor="last_name" inputValue={last_name}>
							Nazwisko
						</Label>
						<Input
							required
							id="last_name"
							name="last_name"
							value={last_name}
							onChange={this.onChange}
						/>
					</FormControl>
				</FormGroup>
				<FormGroup>
					<PhoneNumberInput
						required
						phone_prefix={phone_prefix}
						phone_number={phone_number}
						onChange={this.onChange}
						onChangePrefix={(val) =>
							this.setState((prevState) => ({
								...prevState,
								phone_prefix: val,
							}))
						}
					/>
					<FormControl>
						<Label htmlFor="fax_number" inputValue={fax_number}>
							Drugi numer tel.
						</Label>
						<Input
							id="fax_number"
							name="fax_number"
							value={fax_number}
							onChange={this.onChange}
						/>
					</FormControl>
				</FormGroup>
				<Button
					type="submit"
					success
					loading={loading}
					loadingText="Zapisywanie"
					className="center-item"
				>
					Zapisz i wybierz
				</Button>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	business_id: state.data.business.data.id,
})

const mapDispatchToProps = {
	addCustomer,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomerForm)
