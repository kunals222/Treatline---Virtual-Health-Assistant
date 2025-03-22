import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import logo from '../assets/logo.svg';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        // navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="TreatLine" />
                <h1>TreatLine</h1>
            </div>
            <button className="navbar-toggle" onClick={toggleNavbar}>
                ☰
            </button>
            <div className={`links ${isOpen ? 'open' : ''}`}>
                <a href="/#home">Home</a>
                <a href="/#about">About Us</a>
                <a href="/#contact">Contact Us</a>
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
