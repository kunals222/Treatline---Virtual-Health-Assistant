import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import logo from '../assets/logo1.png';
import '../styles/Navbar.css';
import { ToastContainer } from 'react-toastify';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { token, role } = useSelector((state) => state.auth);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
        if (isDropdownOpen) setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleRegisterClick = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleRegisterOptionClick = (role) => {
        if (role === 'doctor') {
            navigate('/register/doctor');
        } else if (role === 'patient') {
            navigate('/register/patient');
        }
        setIsDropdownOpen(false);
        setIsOpen(false);
    };

    const handleLoginClick = () => {
        navigate('/login');
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const closeDropdown = () => {
            if (isDropdownOpen) setIsDropdownOpen(false);
        };
        
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isDropdownOpen]);

    const getNavLinks = () => {
        if (!token) {
            return (
                <>
                    <Link to="/">Home</Link>
                    <Link to="/service">Services</Link>
                </>
            );
        }

        // Navigation links for logged-in patients
        if (role === 'patient') {
            return (
                <>
                    <Link to="/">Home</Link>
                    <Link to="/doctors">DoctorSearch</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </>
            );
        }

        // Navigation links for logged-in redoctors
        return (
            <>
                <Link to="/">Home</Link>
                <Link to="/service">Services</Link>
                <Link to="/dashboard">Dashboard</Link>
            </>
        );
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="logo">
                <img src={logo} alt="TreatLine" />
                <h1>TreatLine</h1>
            </div>
            <div className={`links ${isOpen ? 'open' : ''}`}>
                {getNavLinks()}
                {token ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <>
                        <div className="register-dropdown" onClick={(e) => e.stopPropagation()}>
                            <button onClick={handleRegisterClick}>Register</button>
                            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                                <button onClick={() => handleRegisterOptionClick('doctor')}>Doctor</button>
                                <button onClick={() => handleRegisterOptionClick('patient')}>Patient</button>
                            </div>
                        </div>
                        <button className="register-dropdown" onClick={handleLoginClick}>
                            Login
                        </button>
                    </>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <button className="navbar-toggle" onClick={toggleNavbar}>
                {isOpen ? '✕' : '☰'}
            </button>
        </nav>
    );
};

export default Navbar;
