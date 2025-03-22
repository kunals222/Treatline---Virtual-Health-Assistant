import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DoctorRegistration from './pages/DoctorRegistration';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<DoctorRegistration />} />
                        <Route path="/login" element={<DoctorLogin />} />
                        <Route path="/dashboard" element={<DoctorDashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;