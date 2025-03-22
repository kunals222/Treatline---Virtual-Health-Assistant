import React from 'react';
import '../styles/AboutUs.css';
import virtualHealthImage from '../assets/doctors-1.jpg';

const AboutUs = () => {
    return (
        <div id="about" className="about-us">
            <div className="about-content">
                <h2>About Us</h2>
                <p>
                    Welcome to <strong>TreatLine</strong> - Your Virtual Health Assistant! 
                    We are dedicated to transforming the healthcare experience by providing 
                    seamless and efficient telemedicine appointment scheduling. Our platform 
                    bridges the gap between patients and healthcare professionals, making quality 
                    healthcare more accessible and convenient.
                </p>
                <p>
                    TreatLine utilizes advanced AI and machine learning to optimize appointment 
                    scheduling based on urgency, availability, and language preferences. With 
                    features like gender preference selection and real-time communication, we 
                    ensure a comfortable and personalized experience for everyone.
                </p>
                <p>
                    Our goal is to empower patients and doctors with an intuitive, reliable, and 
                    secure platform that fosters better healthcare connections. Whether you're a 
                    patient looking for urgent care or a doctor managing a busy schedule, TreatLine 
                    makes healthcare simple and effective.
                </p>
            </div>
            <div className="about-image">
                <img src={virtualHealthImage} alt="Virtual Health Assistant" />
            </div>
        </div>
    );
};

export default AboutUs;
