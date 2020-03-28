const initialStore = {
    loading:true,
    user:null,
    token : localStorage.getItem("token"),
    isAuth:false
}

export default function(state = initialStore,{type,payload}) {
    switch (type) {

        case "USER_LOADED":
            return {
                ...state,
                isAuth:true,
                loading:false,
                user:payload
            }

        
        case "REGISTER_SUCCESS":
        case "LOGIN_SUCCESS":
            localStorage.setItem("token",payload.token)
            return{
                ...state,
                ...payload,
                isAuth:true,
                loading:false
            }
        case "REGISTER_FAIL":
        case "USER_FAIL":
        case "LOGIN_FAIL":
        case "LOGOUT":
            localStorage.removeItem("token");
            return{
                ...state,
                isAuth:false,
                loading:false,
                token:null
            }
        default:
            return state;
    }
}