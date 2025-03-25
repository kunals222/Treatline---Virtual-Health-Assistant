import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/logo1.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section branding">
          <div className="footer-logo">
            <img src={logo} alt="TreatLine" />
            <h2>TreatLine</h2>
          </div>
          
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/doctors">Find Doctors</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>For Patients</h3>
          <ul>
            <li><Link to="/register/patient">Patient Registration</Link></li>
            <li><Link to="/login">Patient Login</Link></li>
            <li><Link to="/appointments">Book Appointment</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>For Doctors</h3>
          <ul>
            <li><Link to="/register/doctor">Doctor Registration</Link></li>
            <li><Link to="/login">Doctor Login</Link></li>
            <li><Link to="/doctor-dashboard">Doctor Dashboard</Link></li>
            <li><Link to="/terms">Terms for Doctors</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} TreatLine. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="separator">|</span>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
