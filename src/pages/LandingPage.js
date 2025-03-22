import React from 'react';
import Home from './Home';
import About from './AboutUs';
import Contact from './ContactUs';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Home />
            <About />
            <Contact />
        </div>
    );
};

export default LandingPage;