import React, { useState, useEffect } from 'react';
import '../styles/DoctorDashboard.css';
import Profile from '../pages/Profile.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateDoctorSchedule, fetchAppointments } from '../redux/slices/authSlice';

const DoctorDashboard = () => {
    const [activeSection, setActiveSection] = useState('scheduled');
    const dispatch = useDispatch();
    const { user, loading, error, pastAppointments, currentAppointments } = useSelector((state) => state.auth);
    const [selectedSlots, setSelectedSlots] = useState([]);

    const timeSlots = [
        '0:00 - 3:00',
        '3:00 - 6:00',
        '6:00 - 9:00',
        '9:00 - 12:00',
        '12:00 - 15:00',
        '15:00 - 18:00',
        '18:00 - 21:00',
        '21:00 - 24:00'
    ];

    useEffect(() => {
        dispatch(fetchDoctorProfile());
        dispatch(fetchAppointments());
    }, [dispatch]);

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

    return (
        <div className="dashboard">
            <div className="sidebar">
                <button onClick={() => setActiveSection('scheduled')}>Upcoming Appointments</button>
                <button onClick={() => setActiveSection('history')}>Appointment History</button>
                <button onClick={() => setActiveSection('availability')}>Manage Availability</button>
                <button onClick={() => setActiveSection('profile')}>Doctor Profile</button>
            </div>
            <div className="content">
                {activeSection === 'scheduled' && (
                    <div className="appointments">
                        {currentAppointments?.map((appt, index) => (
                            <div className="appointment-card" key={index}>
                                <h3>{appt.patient}</h3>
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
                                <button className="join-meeting-button">Join Meeting</button>
                            </div>
                        ))}
                    </div>
                )}
                {activeSection === 'history' && (
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
                                    <td>{record.patient}</td>
                                    <td>{record.symptoms}</td>
                                    <td>{new Date(record.start).toLocaleDateString()}</td>
                                    <td>{record.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {activeSection === 'availability' && (
                    <div className="availability">
                        <h3>Select Available Time Slots:</h3>
                        <table className="slot-checkboxes">
                            <tbody>
                                {Array.from({ length: 4 }).map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {timeSlots.slice(rowIndex * 2, rowIndex * 2 + 2).map((slot, index) => (
                                            <td
                                                key={index}
                                                className={`slot-label ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                                                onClick={() => handleCheckboxChange(slot)}
                                                style={{
                                                    backgroundColor: selectedSlots.includes(slot)
                                                        ? user?.time_slot[timeSlots.indexOf(slot)] === 1
                                                            ? '#28a745' // Green for initially selected slots
                                                            : '#ccffcc' // Light green for selected slots
                                                        : user?.time_slot[timeSlots.indexOf(slot)] === 1
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
                                                {slot}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="update-schedule-button" onClick={handleScheduleUpdate}>Update Schedule</button>
                                            </div>
                )}
                {activeSection === 'profile' && <Profile profile={user} />}
            </div>
        </div>
    );
};

export default DoctorDashboard;
