import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {}

const middleware = [thunk]

const store = createStore(
	rootReducer,
	initialState,
	!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
		? composeWithDevTools(applyMiddleware(...middleware))
		: applyMiddleware(...middleware)
)

export default store
