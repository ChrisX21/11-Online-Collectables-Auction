import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import NotFound from './Error/NotFound/NotFound'
import Login from './Login/Login'
import Register from './Register/Register'
import Navbar from '../Components/Navbar/Navbar'

function Pages() {
    return (
    <>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    </>
    )
}

export default Pages