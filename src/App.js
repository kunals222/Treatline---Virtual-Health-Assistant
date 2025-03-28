import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientRegistration from './pages/PatientRegistration'; // Import PatientRegistration
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import Service from './components/Service'; // Import the Service component
import PatientDashboard from './pages/PatientDashboard'; // Import PatientDashboard
import Chatbot from './components/chatbot'; // Import Chatbot

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register/doctor" element={<DoctorRegistration />} />
                        <Route path="/register/patient" element={<PatientRegistration />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<DoctorDashboard />} />
                        <Route path="/service" element={<Service />} /> {/* Add route for Service component */}
                        <Route path="/patient/dashboard" element={<PatientDashboard />} /> {/* Add route for PatientDashboard component */}
                    </Routes>
                </div>
                <Chatbot /> {/* Add Chatbot component */}
            </div>
        </Router>
    );
};

export default App;