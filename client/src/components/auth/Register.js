import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {connect} from "react-redux"


import {setAlert} from "../../store/actions/alert"

const Register = ({setAlert}) => {

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
            console.log(formData)
        }
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

export default connect(null , {setAlert}) (Register)
