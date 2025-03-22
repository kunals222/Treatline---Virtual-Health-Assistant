import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, HelpCircle } from 'lucide-react';
import '../styles/ContactUs.css';

const ContactUs = () => {
    return (
        <div id='contact' className="contact-us">
            <h2>Contact Us</h2>
            <div className="contact-box">
                <div className="contact-section">
                    <h3>Contact Information</h3>
                    <p><Mail size={20} />support@treatline.com</p>
                    <p><Phone size={20} />+1 234 567 890</p>
                    <p><MapPin size={20} />Wellness City, USA</p>
                </div>
                <div className="contact-section">
                    <h3>Social Media</h3>
                    <p>
                        <Facebook size={20} /> 
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>
                    </p>
                    <p>
                        <Twitter size={20} /> 
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>
                    </p>
                    <p>
                        <Instagram size={20} /> 
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
                    </p>
                </div>
                <div className="contact-section">
                    <h3>Support</h3>
                    <p><HelpCircle size={20} /> For technical support or queries, please email us.</p>
                    <p><Mail size={20} /> Email: help@treatline.com</p>
                </div>
            </div>
            <footer>
                <p>&copy; 2025 TreatLine. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ContactUs;
