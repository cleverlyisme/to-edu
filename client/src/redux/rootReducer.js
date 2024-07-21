import { combineReducers } from "redux"

import loading from "./reducer/loading"
import navigate from "./reducer/navigate"
import user from "./reducer/user"
import modal from "./reducer/modal"
import time from "./reducer/time"
import event from "./reducer/event"
import studentOff from "./reducer/studentOff"

export default combineReducers({
    loading,
    navigate,
    user,
    modal,
    time,
    event,
    studentOff,
})
