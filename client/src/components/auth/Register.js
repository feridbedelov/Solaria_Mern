import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import {register} from "../../store/actions/auth"

import {setAlert} from "../../store/actions/alert"

const Register = ({setAlert,register,isAuth}) => {

    const [formData , setFormData] = useState({
        name:"",
        email: "",
        password: "",
        password2 : ""
    })

    const onChangeHandler = (e) => setFormData({...formData, [e.target.name] : e.target.value })

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(formData.password !== formData.password2){
            setAlert("passwords do not match","danger")
        } else{
            const {name,email,password} = formData
            register({name,email,password})
        }
    }

    if (isAuth) {
        return <Redirect to="/dashboard" />
    }


    return (
        <div>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit = {onSubmitHandler}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" required  value={formData.name} onChange={e => onChangeHandler(e) }  />
                </div>
                <div className="form-group">
                    <input type="email" value={formData.email} onChange={e => onChangeHandler(e)} placeholder="Email Address" name="email" />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={formData.password} onChange={e => onChangeHandler(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={formData.password2} onChange={e => onChangeHandler(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuth
    }
}
export default connect(mapStateToProps , {setAlert ,register }) (Register)
