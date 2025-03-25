import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Protect the route - redirect if not authenticated or not a patient
    if (!user || role !== 'patient') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  return (
    <div className="dashboard-container">
      <h1>Patient Dashboard</h1>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user?.firstName || 'Patient'}!</h2>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Upcoming Appointments</h3>
            {/* Add appointments list here */}
          </div>

          <div className="dashboard-card">
            <h3>Medical History</h3>
            {/* Add medical history here */}
          </div>

          <div className="dashboard-card">
            <h3>Find Doctors</h3>
            {/* Add doctor search functionality */}
          </div>

          <div className="dashboard-card">
            <h3>Profile Settings</h3>
            {/* Add profile settings */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
