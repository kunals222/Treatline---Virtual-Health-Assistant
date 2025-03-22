import React from 'react';
import '../styles/Home.css';

const Home = () => {
    return (
        <div id="home" className="home">
            <div className="home-content">
                <h1>Welcome to TreatLine</h1>
                <h2>Optimize Your Healthcare Services</h2>
                <p style={{color: 'white'}}>
                    TreatLine is an advanced telemedicine appointment scheduler designed to optimize healthcare services.
                    Our platform helps patients connect with healthcare professionals based on urgency, availability, 
                    language preferences, and gender preferences. TreatLine leverages cutting-edge AI and ML techniques to 
                    ensure a seamless and personalized experience for every user.
                </p>
                <p style={{color: 'white'}}>
                    With TreatLine, you can easily book appointments with doctors who speak your language and match your 
                    communication preferences, making healthcare more accessible and comfortable for everyone.
                </p>
            </div>
        </div>
    );
};

export default Home;