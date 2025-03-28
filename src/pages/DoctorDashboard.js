import React, { useState, useEffect } from 'react';
import '../styles/DoctorDashboard.css';
import Profile from '../pages/Profile.js';
import PatientProfile from './PatientProfile.js';
import BookAppointment from './BookAppointment.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateDoctorSchedule, fetchAppointments, fetchPatientDetails, submitFeedback } from '../redux/slices/authSlice';

const DoctorDashboard = () => {
    const [activeSection, setActiveSection] = useState('scheduled');
    const [feedback, setFeedback] = useState('');
    const dispatch = useDispatch();
    const { user, loading, error, pastAppointments, currentAppointments, role, appointment } = useSelector((state) => state.auth);
    const [selectedSlots, setSelectedSlots] = useState([]);

    const timeSlots = [
        '12:00 AM - 3:00 AM',
        '3:00 AM - 6:00 AM',
        '6:00 AM - 9:00 AM',
        '9:00 AM - 12:00 PM',
        '12:00 PM - 3:00 PM',
        '3:00 PM - 6:00 PM',
        '6:00 PM - 9:00 PM',
        '9:00 PM - 12:00 AM'
    ];

    useEffect(() => {
        if (role === 'doctor') {
            dispatch(fetchDoctorProfile());
            dispatch(fetchAppointments());
        } else if (role === 'patient') {
            dispatch(fetchPatientDetails());
        }
    }, [dispatch, role]);

    useEffect(() => {
        if (user?.time_slot) {
            const initialSchedule = timeSlots.filter((_, index) => user?.time_slot[index] === 1);
            setSelectedSlots(initialSchedule);
        }
    }, [user]);

    const handleCheckboxChange = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter((s) => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const handleScheduleUpdate = () => {
        const updatedTimeSlot = timeSlots.map((slot) => (selectedSlots.includes(slot) ? 1 : 0));
        dispatch(updateDoctorSchedule(updatedTimeSlot));
    };

    const handleFeedbackSubmit = () => {
        dispatch(submitFeedback({ feedback }));
        setFeedback('');
    };

    const handleJoinMeeting = (appointmentId) => {
        const meetingUrl = `http://localhost:4000/${appointmentId}`;
        window.open(meetingUrl, '_blank');
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                {role === 'doctor' && (
                    <>
                        <button onClick={() => setActiveSection('scheduled')}>Upcoming Appointments</button>
                        <button onClick={() => setActiveSection('history')}>Appointment History</button>
                        <button onClick={() => setActiveSection('availability')}>Manage Availability</button>
                        <button onClick={() => setActiveSection('profile')}>Doctor Profile</button>
                        <button onClick={() => setActiveSection('feedback')}>Feedback</button>
                    </>
                )}
                {role === 'patient' && (
                    <>
                        <button onClick={() => setActiveSection('profile')}>Profile</button>
                        <button onClick={() => setActiveSection('makeAppointment')}>Book Appointment</button>
                        <button onClick={() => setActiveSection('history')}>Appointment History</button>
                        <button onClick={() => setActiveSection('scheduled')}>Scheduled Appointments</button>
                    </>
                )}
            </div>
            <div className="content">
                {role === 'doctor' && activeSection === 'scheduled' && (
                    <div className="appointments">
                        {currentAppointments?.map((appt, index) => (
                            <div className="appointment-card" key={index}>
                                <h3>Patient : {appt.patientName}</h3>
                                <div className="appointment-time">
                                    <span>Start: {new Date(appt.start).toLocaleString()}</span>
                                    <span>End: {new Date(appt.end).toLocaleString()}</span>
                                </div>
                                <div className="appointment-details">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="label">💉 Symptoms:</td>
                                                <td>{appt.symptoms}</td>
                                            </tr>
                                            <tr>
                                                <td className="label">📝 Notes:</td>
                                                <td>{appt.notes}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <button className="join-meeting-button" onClick={() => handleJoinMeeting(appt._id)}>Join Meeting</button>
                            </div>
                        ))}
                    </div>
                )}
                {role === 'patient' && activeSection === 'scheduled' && appointment && (
                    <div className="appointments">
                        <div className="appointment-card">
                            <h3>Doctor : {appointment.doctorName}</h3>
                            <div className="appointment-time">
                                <span>Start: {new Date(appointment.start).toLocaleString()}</span>
                                <span>End: {new Date(appointment.end).toLocaleString()}</span>
                            </div>
                            <div className="appointment-details">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="label">💉 Symptoms:</td>
                                            <td>{appointment.symptoms}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">📝 Notes:</td>
                                            <td>{appointment.notes}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="join-meeting-button" onClick={() => handleJoinMeeting(appointment._id)}>Join Meeting</button>
                        </div>
                    </div>
                )}
                {role === 'doctor' && activeSection === 'history' && (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Symptoms</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastAppointments?.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.patientName}</td>
                                    <td>{record.symptoms}</td>
                                    <td>{new Date(record.start).toLocaleDateString()}</td>
                                    <td>{record.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {role === 'doctor' && activeSection === 'availability' && (
                    <div className="availability">
                        <h3 className="availability-title">Select Available Time Slots:</h3>
                        <div className="slot-grid">
                            {timeSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className={`slot-label ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                                    onClick={() => handleCheckboxChange(slot)}
                                    style={{
                                        backgroundColor: selectedSlots.includes(slot)
                                            ? user?.time_slot[index] === 1
                                                ? '#28a745' // Green for initially selected slots
                                                : '#ccffcc' // Light green for selected slots
                                            : user?.time_slot[index] === 1
                                            ? '#ffcccc' // Light red for newly deselected slots
                                            : '#ecf0f1' // Default light grey
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSlots.includes(slot)}
                                        onChange={() => handleCheckboxChange(slot)}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="slot-icon">⏰</span>
                                    <span className="slot-text">{slot}</span>
                                </div>
                            ))}
                        </div>
                        <button className="update-schedule-button" onClick={handleScheduleUpdate}>
                            <span className="button-icon">✔️</span> Update Schedule
                        </button>
                    </div>
                )}
                {role === 'doctor' && activeSection === 'profile' && <Profile />}
                {role === 'patient' && activeSection === 'profile' && <PatientProfile />}

                {role === 'patient' && activeSection === 'makeAppointment' && (
                    <div className="make-appointment">
                        <BookAppointment />
                    </div>
                )}
                {role === 'patient' && activeSection === 'history' && (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Symptoms</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastAppointments?.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.doctor}</td>
                                    <td>{record.symptoms}</td>
                                    <td>{new Date(record.start).toLocaleDateString()}</td>
                                    <td>{record.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {role === 'doctor' && activeSection === 'feedback' && (
                    <div className="feedback-section">
                        <h3>Submit Feedback</h3>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter your feedback"
                            className="feedback-textarea"
                        />
                        <button onClick={handleFeedbackSubmit} className="submit-feedback-button">Submit Feedback</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
