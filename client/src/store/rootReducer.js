import { combineReducers } from "redux"

import alertReducer from "./reducers/alert"
import authReducer from "./reducers/authReducer"

export default combineReducers({
    alert: alertReducer,
    auth: authReducer

})