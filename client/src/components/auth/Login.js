import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../../store/actions/auth'
import {connent, connect} from "react-redux"


const Login = ({login,isAuth}) => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmitHandler = (e) => {
        e.preventDefault();
        login(formData.email , formData.password);
    }

    if(isAuth){
        return <Redirect to="/dashboard" />
    }

    return (
        <div>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={onSubmitHandler}>
                <div className="form-group">
                    <input type="email" value={formData.email} onChange={e => onChangeHandler(e)} placeholder="Email Address" name="email" />
                   
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
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        isAuth : state.auth.isAuth
    }
}


export default connect(mapStateToProps,{login})(Login)
