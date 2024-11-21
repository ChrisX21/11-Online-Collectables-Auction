import React from 'react'
import {Link} from 'react-router-dom'
import styles from './Register.module.css'

function Register(){
    return (
        <div>
            <h1>Register</h1>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default Register