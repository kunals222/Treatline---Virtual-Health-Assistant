import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import logo from '../assets/logo1.png';
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleRegisterClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleRegisterOptionClick = (role) => {
        if (role === 'doctor') {
            navigate('/register/doctor');
        } else if (role === 'patient') {
            navigate('/register/patient');
        }
        setIsDropdownOpen(false);
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
                <a href="/#about">About</a>
                <a href="/#contact">Contact</a>
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <div className="register-dropdown">
                            <button onClick={handleRegisterClick}>Register</button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button onClick={() => handleRegisterOptionClick('doctor')}>Doctor</button>
                                    <button onClick={() => handleRegisterOptionClick('patient')}>Patient</button>
                                </div>
                            )}
                        </div>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
