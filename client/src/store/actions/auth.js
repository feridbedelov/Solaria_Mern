import axios from "axios"
import { setAlert } from "./alert";
import { setAuthToken } from "../../utils/util";




export const loadUser = () => {
    return async dispatch => {

        if (localStorage.token) {
            setAuthToken(localStorage.token)
        }

        try {

            const response = await axios.get("/api/auth");
            dispatch({
                type: "USER_LOADED",
                payload: response.data
            })

        } catch (error) {
            dispatch({
                type: "USER_FAIL"
            })
        }
    }
}





export const register = ({ name, email, password }) => {
    return async dispatch => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const body = JSON.stringify({ name, email, password });

        try {
            const response = await axios.post("/api/users", body, config);

            dispatch({
                type: "REGISTER_SUCCESS",
                payload: response.data
            })

            dispatch(loadUser())

        } catch (err) {
            const errors = err.response.data.errors;
            
            if (errors) {
                errors.forEach(err => {
                    dispatch(setAlert(err.msg, "danger"))
                })
            }

            dispatch({
                type: "REGISTER_FAIL"
            })


        }
    }
}


export const logout = () => {
    return async dispatch => {
    dispatch({type: "LOGOUT" })
    }
}



export const login = (email, password) => {
    return async dispatch => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const body = JSON.stringify({ email, password });

        try {
            const response = await axios.post("/api/auth", body, config);

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data
            })

            dispatch(loadUser())

        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach(err => {
                    dispatch(setAlert(err.msg, "danger"))
                })
            }

            dispatch({
                type: "LOGIN_FAIL"
            })

        }

    }
}