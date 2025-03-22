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
        // dispatch(fetchDoctorProfile());
        dispatch(fetchAppointments());
        console.log("kunal");
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
                <button onClick={() => setActiveSection('scheduled')}>Scheduled Appointments</button>
                <button onClick={() => setActiveSection('history')}>History</button>
                <button onClick={() => setActiveSection('availability')}>Set Availability</button>
                <button onClick={() => setActiveSection('profile')}>Profile</button>
            </div>
            <div className="content">
                {activeSection === 'scheduled' && (
                    <div className="appointments">
                        {currentAppointments?.map((appt, index) => (
                            <div className="appointment-card" key={index}>
                                <h3>{appt.patient}</h3>
                                <p>Time: </p>
                                
                                <p>Start: {new Date(appt.start).toLocaleString()}</p>
                                <p>End: {new Date(appt.end).toLocaleString()}</p>
                                
                                <p>Symptoms: {appt.symptoms}</p>
                                <p>Notes: {appt.notes}</p>
                                
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
                        <div className="slot-checkboxes">
                            {timeSlots.map((slot, index) => (
                                <label key={index} className="slot-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedSlots.includes(slot)}
                                        onChange={() => handleCheckboxChange(slot)}
                                    />
                                    {slot}
                                </label>
                            ))}
                        </div>
                        <button onClick={handleScheduleUpdate}>Update Schedule</button>
                        <h4>Current Schedule:</h4>
                        <ul className="schedule-list">
                            {selectedSlots.length > 0 ? (
                                selectedSlots.map((slot, index) => (
                                    <li key={index}>{slot}</li>
                                ))
                            ) : (
                                <li>No slots selected</li>
                            )}
                        </ul>
                    </div>
                )}
                {activeSection === 'profile' && <Profile profile={user} />}
            </div>
        </div>
    );
};

export default DoctorDashboard;
