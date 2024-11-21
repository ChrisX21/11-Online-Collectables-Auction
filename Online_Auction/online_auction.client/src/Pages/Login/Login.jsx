import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Login.module.css'

function Login(){
    return (
        <div>
            <h1>Login</h1>
            <Link to="/register">Register</Link>
        </div>
    )
}

export default Login