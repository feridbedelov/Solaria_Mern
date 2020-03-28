import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {logout} from "../../store/actions/auth"

const Navbar = ({logout,loading,isAuth}) => {

    const guestlinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    const authLinks = (
        <ul>
            <li><a onClick ={logout} >Logout</a></li>
        </ul>
    )

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> Solaria.</Link>
            </h1>
            {!loading && (<Fragment>{isAuth ?authLinks :guestlinks} </Fragment>)   }
        </nav>
    )
}

const mapStateToProps = state => {
    return {
        isAuth :state.auth.isAuth,
        loading:state.auth.loading
    }
}


export default connect(mapStateToProps,{logout})( Navbar)