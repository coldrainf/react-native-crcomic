import { createStore,combineReducers } from 'redux'

import * as theme from './theme/reducer'

const store = createStore(
    combineReducers({...theme})
)

export default store