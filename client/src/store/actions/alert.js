import {v4} from "uuid"

export const setAlert = (msg , alertType  ) => {
    return dispatch => {
        const id = v4()
        dispatch({type:"SET_ALERT" , payload: {msg,id,alertType} })

        setTimeout(() => {
            dispatch({type:"REMOVE_ALERT" , payload: id })
        } , 5000 )
    }
} 

