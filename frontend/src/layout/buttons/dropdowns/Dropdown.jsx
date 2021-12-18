import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { useId } from 'react-id-generator'
import '../../../assets/css/dropdown.css'

import Input from '../../forms/inputs/Input'
import Button from '../Button'

import { ImCross } from 'react-icons/im'
import { Component } from 'react'
import { withDebounce } from '../../../helpers/hooks/debounce'
import i18next from 'i18next'

class Dropdown extends Component {
	static propTypes = {
		required: PropTypes.bool,
		translate: PropTypes.bool,
		searchAsync: PropTypes.bool,
		isLoading: PropTypes.bool,
		loadOptions: PropTypes.func,
		isMulti: PropTypes.bool,
		editable: PropTypes.bool,
		regexValidation: PropTypes.instanceOf(RegExp),
		options: PropTypes.array,
		value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		searchable: PropTypes.array,
		onChange: PropTypes.func.isRequired,
		getOptionLabel: PropTypes.func,
		getOptionValue: PropTypes.func,
		getValuesValue: PropTypes.func,
		formatOptionLabel: PropTypes.func,
		formatSelectedOptionValue: PropTypes.func,
		setShowInput: PropTypes.func,
		debouncedValue: PropTypes.string,
		setDebouncedValue: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.container = React.createRef()
		this.cachedSearchKeys = {}

		this.state = {
			isOpen: false,
			inputValue: '',
			filteredOptions: props.options,
			loading:
				props.isLoading === null
					? props.options.length === 0
					: props.isLoading,
			navigatedIndex: 0,
		}

		this.isNotSelected = this.isNotSelected.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.asyncLoadOptions = this.asyncLoadOptions.bind(this)
	}

	isNotSelected = (option) => {
		const { value, isMulti, getOptionValue, getValuesValue } = this.props

		const _value = value
			? !isMulti
				? getValuesValue(value)
				: value.map((option) => getValuesValue(option))
			: null

		return (
			(isMulti && !_value.includes(getOptionValue(option))) ||
			(!isMulti && _value !== getOptionValue(option))
		)
	}

	handleClickOutside = (e) => {
		const { isMulti, value, setShowInput, setDebouncedValue } = this.props

		if (
			this.container.current &&
			!this.container.current.contains(e.target) &&
			e.offsetX <= e.target.clientWidth - 1 &&
			e.offsetY <= e.target.clientHeight - 1
		) {
			setDebouncedValue('')
			this.setState({ isOpen: false, inputValue: '' })

			if (isMulti && value.length > 0) setShowInput(false)
		}
	}

	handleOnChange = (option) => {
		this.props.onChange(option)
		this.props.setDebouncedValue('')
		this.setState({ isOpen: false, inputValue: '' })
	}

	handleKeyDown = (e) => {
		const { isMulti, value, setShowInput } = this.props
		const { isOpen, filteredOptions, navigatedIndex } = this.state

		// arrow up/down button should select next/previous list element
		switch (e.keyCode) {
			case 38: // Up Arrow
				this.setState((prevState) => ({
					navigatedIndex:
						prevState.navigatedIndex > 0
							? prevState.navigatedIndex - 1
							: prevState.filteredOptions.length - 1,
				}))
				break
			case 40: // Down Arrow
				this.setState((prevState) => ({
					navigatedIndex:
						prevState.navigatedIndex <
						prevState.filteredOptions.length - 1
							? prevState.navigatedIndex + 1
							: 0,
				}))
				break
			case 32: // Spacebar
				if (!isOpen) this.setState({ isOpen: true })
				break
			case 13: // Enter
				e.preventDefault()

				if (isOpen && filteredOptions.length > 0) {
					this.handleOnChange(filteredOptions[navigatedIndex])
					this.setState({ navigatedIndex: 0 })
				} else this.setState({ isOpen: true })

				break
			case 9: // TAB
				this.setState({ isOpen: false })

				if (isMulti && value.length > 0) setShowInput(false)
				break
			default:
				break
		}
	}

	asyncLoadOptions = async () => {
		try {
			this.setState({ loading: true })

			let filteredOptions = await this.props.loadOptions(
				this.props.debouncedValue
			)
			filteredOptions = filteredOptions.filter((option) =>
				this.isNotSelected(option)
			)

			this.setState({
				filteredOptions,
			})

			return filteredOptions
		} finally {
			this.setState({ loading: false })
		}
	}

	componentDidMount = () =>
		document.addEventListener('mousedown', this.handleClickOutside)

	componentWillUnmount = () =>
		document.removeEventListener('mousedown', this.handleClickOutside)

	componentDidUpdate(prevProps, prevState) {
		if (this.state.isOpen !== prevState.isOpen && this.state.isOpen) {
			if (this.props.searchAsync && this.props.options.length === 0) {
				this.asyncLoadOptions().then(
					(filteredOptions) =>
						(this.cachedSearchKeys[this.props.debouncedValue] =
							filteredOptions)
				)
			} else
				this.setState({
					filteredOptions: this.props.options.filter((option) =>
						this.isNotSelected(option)
					),
				})
		}

		if (this.state.inputValue !== prevState.inputValue)
			this.setState({
				loading: this.state.inputValue !== this.props.debouncedValue,
			})

		if (
			this.props.isLoading === null &&
			prevProps.options.length !== this.props.options.length
		)
			this.setState({ loading: this.props.options.length === 0 })

		if (prevProps.isLoading !== this.props.isLoading)
			this.setState({ loading: this.props.isLoading })

		if (prevState.filteredOptions !== this.state.filteredOptions)
			this.setState({ navigatedIndex: 0, loading: false })

		if (prevProps.debouncedValue !== this.props.debouncedValue) {
			if (this.props.debouncedValue in this.cachedSearchKeys) {
				this.setState({
					filteredOptions:
						this.cachedSearchKeys[this.props.debouncedValue],
				})
			} else {
				if (this.props.searchAsync)
					// Search Async
					this.asyncLoadOptions().then(
						(filteredOptions) =>
							(this.cachedSearchKeys[this.props.debouncedValue] =
								filteredOptions)
					)
				// Search Sync
				else
					this.setState({
						filteredOptions: this.props.options.filter(
							(option) =>
								this.isNotSelected(option) &&
								((this.props.searchable == null &&
									this.props
										.getOptionLabel(option)
										.toLowerCase()
										.includes(
											this.props.debouncedValue.toLowerCase()
										)) ||
									(this.props.searchable != null &&
										this.props.searchable.some((key) =>
											option[key]
												.toLowerCase()
												.includes(
													this.props.debouncedValue.toLowerCase()
												)
										)))
						),
					})

				if (
					this.props.editable &&
					((this.props.regexValidation &&
						this.props.regexValidation.test(
							this.props.debouncedValue
						)) ||
						this.props.regexValidation == null)
				) {
					const option = {
						label: this.props.debouncedValue,
						value: this.props.debouncedValue,
					}

					if (this.props.regexValidation) this.handleOnChange(option)
					else this.props.onChange(option)
				}
			}
		}

		if (
			JSON.stringify(this.props.options) !==
			JSON.stringify(prevProps.options)
		)
			this.setState({
				filteredOptions: this.props.options,
				inputValue: '',
			})

		if (
			(!this.props.isMulti &&
				JSON.stringify(prevProps.value) !==
					JSON.stringify(this.props.value)) ||
			(this.props.isMulti &&
				prevProps.value.length !== this.props.value.length)
		) {
			// Reset cached search keys
			this.cachedSearchKeys = {}

			this.setState({
				filteredOptions: this.props.options.filter((option) =>
					this.isNotSelected(option)
				),
			})
		}
	}

	render() {
		const {
			translate,
			required,
			searchAsync,
			loadOptions,
			isMulti,
			isLoading,
			options,
			value,
			onChange,
			getOptionLabel,
			getOptionValue,
			getValuesValue,
			formatOptionLabel,
			formatSelectedOptionValue,
			setShowInput,
			editable,
			regexValidation,
			setDebouncedValue,
			debouncedValue,
			...props
		} = this.props
		const { inputValue, isOpen, loading, filteredOptions, navigatedIndex } =
			this.state

		return (
			<div
				className="dropdown"
				ref={this.container}
				onFocus={() => this.setState({ isOpen: true })}
				onKeyDown={this.handleKeyDown}
			>
				{!isMulti &&
					value !== null &&
					Object.keys(value).length > 0 &&
					inputValue === '' && (
						<div
							className="dropdown__value"
							style={
								formatSelectedOptionValue
									? { bottom: '-3px' }
									: {}
							}
						>
							{formatSelectedOptionValue
								? formatSelectedOptionValue(value)
								: translate
								? i18next.t(getOptionLabel(value)[0], {
										ns: getOptionLabel(value)[1],
								  })
								: getOptionLabel(value)}
						</div>
					)}

				<div className="dropdown__input-container">
					<Input
						required={
							required &&
							((!isMulti && Object.keys(value).length === 0) ||
								(isMulti && value.length === 0))
						}
						onClick={() => this.setState({ isOpen: true })}
						onInput={() => this.setState({ isOpen: true })}
						value={inputValue}
						onChange={(e) => {
							setDebouncedValue(e.target.value)
							this.setState({ inputValue: e.target.value })
						}}
						autoComplete="off"
						{...props}
					/>
				</div>
				{isOpen && (
					<div className="dropdown-options">
						{!loading ? (
							filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<div
										className={`dropdown-options__option${
											option.disabled ? ' disabled' : ''
										}${
											navigatedIndex === index
												? ' navigated'
												: ''
										}`}
										onClick={() =>
											this.handleOnChange(option)
										}
										onMouseMove={() => {
											if (navigatedIndex !== index)
												this.setState({
													navigatedIndex: index,
												})
										}}
										key={getOptionValue(option)}
									>
										{formatOptionLabel
											? formatOptionLabel(option)
											: translate
											? i18next.t(
													getOptionLabel(option)[0],
													{
														ns: getOptionLabel(
															option
														)[1],
													}
											  )
											: getOptionLabel(option)}
									</div>
								))
							) : (
								<div className="dropdown-options__text">
									Nic nie znaleziono
								</div>
							)
						) : (
							<div className="dropdown-options__text loading-spinner">
								Ładowanie...
							</div>
						)}
					</div>
				)}
			</div>
		)
	}
}

function ClearBtn({ clear, value, ...props }) {
	const [tooltipId] = useId(1, 'clearableTip')

	if (!value) return null

	return (
		<>
			<Button
				type="button"
				onClick={clear}
				rounded
				data-tip="Wyczyść"
				data-for={tooltipId}
				{...props}
			>
				<ImCross size="12" />
			</Button>
			<ReactTooltip
				id={tooltipId}
				place="top"
				effect="solid"
				delayShow={250}
			/>
		</>
	)
}

ClearBtn.prototype.propTypes = {
	clear: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

function InputContainer({ children, ...props }) {
	return (
		<div className="dropdown__input-container" {...props}>
			{children}
		</div>
	)
}

export {
	ClearBtn as DropdownClearBtn,
	InputContainer as DropdownInputContainer,
}
export default withDebounce(Dropdown, 500)
