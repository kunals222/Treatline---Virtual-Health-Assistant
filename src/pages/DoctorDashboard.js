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
    const [selectedDay, setSelectedDay] = useState('monday');
    const [feedbackCategory, setFeedbackCategory] = useState('');
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [feedbackTitle, setFeedbackTitle] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [availabilityByDay, setAvailabilityByDay] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    });
    
    const dispatch = useDispatch();
    const { user, loading, error, pastAppointments, currentAppointments, role } = useSelector((state) => state.auth);
    const [selectedSlots, setSelectedSlots] = useState([]);

    // Enhanced time slots with AM/PM and period indicators
    const timeSlots = [
        { id: 'slot_1', time: '0:00 - 3:00', display: '12:00 - 3:00', period: 'AM', timeOfDay: 'night' },
        { id: 'slot_2', time: '3:00 - 6:00', display: '3:00 - 6:00', period: 'AM', timeOfDay: 'night' },
        { id: 'slot_3', time: '6:00 - 9:00', display: '6:00 - 9:00', period: 'AM', timeOfDay: 'morning' },
        { id: 'slot_4', time: '9:00 - 12:00', display: '9:00 - 12:00', period: 'AM', timeOfDay: 'morning' },
        { id: 'slot_5', time: '12:00 - 15:00', display: '12:00 - 3:00', period: 'PM', timeOfDay: 'afternoon' },
        { id: 'slot_6', time: '15:00 - 18:00', display: '3:00 - 6:00', period: 'PM', timeOfDay: 'afternoon' },
        { id: 'slot_7', time: '18:00 - 21:00', display: '6:00 - 9:00', period: 'PM', timeOfDay: 'evening' },
        { id: 'slot_8', time: '21:00 - 24:00', display: '9:00 - 12:00', period: 'PM', timeOfDay: 'night' }
    ];
    const weekdays = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
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
        if (user?.availability) {
            // If backend sends availability data by day, make sure all days are initialized
            const initializedAvailability = { ...availabilityByDay };
            // Merge the user availability with the initialized state
            Object.keys(user.availability).forEach(day => {
                initializedAvailability[day] = user.availability[day] || [];
            });
            setAvailabilityByDay(initializedAvailability);
        } else if (user?.time_slot) {
            // For backward compatibility with old format
            const initialSlots = [];
            user.time_slot.forEach((isAvailable, index) => {
                if (isAvailable === 1 && index < timeSlots.length) {
                    initialSlots.push(timeSlots[index].id);
                }
            });
            
            // Initialize all days with empty arrays first
            const newAvailability = { ...availabilityByDay };
            newAvailability[selectedDay] = initialSlots;
            
            setAvailabilityByDay(newAvailability);
        }
    }, [user]);

    const handleCheckboxChange = (slotId) => {
        setAvailabilityByDay(prev => {
            const currentDaySlots = [...prev[selectedDay]];
            
            if (currentDaySlots.includes(slotId)) {
                return {
                    ...prev,
                    [selectedDay]: currentDaySlots.filter(id => id !== slotId)
                };
            } else {
                return {
                    ...prev,
                    [selectedDay]: [...currentDaySlots, slotId]
                };
            }
        });
    };

    const handleScheduleUpdate = () => {
        // Convert to format expected by backend
        const formattedAvailability = availabilityByDay;
        dispatch(updateDoctorSchedule(formattedAvailability));
    };

    const handleFeedbackSubmit = () => {
        // Include all feedback data in submission
        dispatch(submitFeedback({ 
            feedback,
            title: feedbackTitle,
            category: feedbackCategory,
            rating: feedbackRating,
            isAnonymous
        }));
        
        // Reset form and show success message
        setFeedback('');
        setFeedbackTitle('');
        setFeedbackCategory('');
        setFeedbackRating(0);
        setIsAnonymous(false);
        setFeedbackSubmitted(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            setFeedbackSubmitted(false);
        }, 5000);
    };

    // Determine if form is valid for submission
    const isFeedbackValid = () => {
        return feedback.length >= 10 && feedbackCategory && feedbackRating > 0;
    };

    // Helper function to get slot object by ID
    const getSlotById = (slotId) => {
        return timeSlots.find(slot => slot.id === slotId);
    };

    // Safe accessor function to prevent undefined errors
    const isSlotSelected = (day, slotId) => {
        return Array.isArray(availabilityByDay[day]) && availabilityByDay[day].includes(slotId);
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <div className="sidebar-logo">
                    <h2>TreatLine</h2>
                </div>
                {role === 'doctor' && (
                    <>
                        <button onClick={() => setActiveSection('scheduled')} className={activeSection === 'scheduled' ? 'active' : ''}>
                            <i className="fas fa-calendar-check"></i>
                            <span>Upcoming Appointments</span>
                        </button>
                        <button onClick={() => setActiveSection('history')} className={activeSection === 'history' ? 'active' : ''}>
                            <i className="fas fa-history"></i>
                            <span>Appointment History</span>
                        </button>
                        <button onClick={() => setActiveSection('availability')} className={activeSection === 'availability' ? 'active' : ''}>
                            <i className="fas fa-clock"></i>
                            <span>Manage Availability</span>
                        </button>
                        <button onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>
                            <i className="fas fa-user-md"></i>
                            <span>Doctor Profile</span>
                        </button>
                        <button onClick={() => setActiveSection('feedback')} className={activeSection === 'feedback' ? 'active' : ''}>
                            <i className="fas fa-comment-alt"></i>
                            <span>Feedback</span>
                        </button>
                    </>
                )}
                {role === 'patient' && (
                    <>
                        <button onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>
                            <i className="fas fa-user"></i>
                            <span>Profile</span>
                        </button>
                        <button onClick={() => setActiveSection('makeAppointment')} className={activeSection === 'makeAppointment' ? 'active' : ''}>
                            <i className="fas fa-calendar-plus"></i>
                            <span>Book Appointment</span>
                        </button>
                        <button onClick={() => setActiveSection('history')} className={activeSection === 'history' ? 'active' : ''}>
                            <i className="fas fa-history"></i>
                            <span>Appointment History</span>
                        </button>
                    </>
                )}
            </div>
            <div className="content">
                {role === 'doctor' && activeSection === 'scheduled' && (
                    <>
                        <div className="content-header">
                            <h2>Upcoming Appointments</h2>
                        </div>
                        <div className="appointments">
                            {currentAppointments?.length > 0 ? currentAppointments.map((appt, index) => (
                                <div className="appointment-card" key={index}>
                                    <span className="appointment-status status-confirmed">Confirmed</span>
                                    <h3>{appt.patientName}</h3>
                                    <div className="appointment-patient-info">
                                        <div className="patient-avatar">
                                            {appt.patientName?.charAt(0).toUpperCase() || "P"}
                                        </div>
                                        <div className="patient-details">
                                            <p className="patient-name">{appt.patientName}</p>
                                            <p className="patient-contact">{appt.patientEmail || "No email provided"}</p>
                                        </div>
                                    </div>
                                    <div className="appointment-time">
                                        <span>
                                            <i className="far fa-clock time-icon"></i>
                                            Start: {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span>
                                            <i className="fas fa-hourglass-end time-icon"></i>
                                            End: {new Date(appt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="label">💉 Symptoms:</td>
                                                    <td>{appt.symptoms || "No symptoms recorded"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="label">📝 Notes:</td>
                                                    <td>{appt.notes || "No additional notes"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="label">📅 Date:</td>
                                                    <td>{new Date(appt.start).toLocaleDateString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="join-meeting-button">
                                        <i className="fas fa-video"></i> Join Meeting
                                    </button>
                                </div>
                            )) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📅</div>
                                    <p className="empty-state-text">You have no upcoming appointments</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {role === 'doctor' && activeSection === 'history' && (
                    <div className="history-section">
                        <div className="history-header">
                            <h3>Appointment History</h3>
                            <div className="history-filters">
                                <div className="history-filter active">All</div>
                                <div className="history-filter">This Week</div>
                                <div className="history-filter">This Month</div>
                            </div>
                        </div>
                        <div className="history-table-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Symptoms</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastAppointments?.length > 0 ? pastAppointments.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.patientName}</td>
                                            <td>{record.symptoms || "N/A"}</td>
                                            <td>{new Date(record.start).toLocaleDateString()}</td>
                                            <td>{new Date(record.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>
                                                <span className="status-badge status-confirmed">Completed</span>
                                            </td>
                                            <td>{record.notes || "No notes"}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                                No past appointments found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {role === 'doctor' && activeSection === 'availability' && (
                    <div className="availability">
                        <h3>
                            <i className="fas fa-clock"></i>
                            Manage Your Availability
                        </h3>
                        
                        <div className="time-period-legend">
                            <div className="legend-item">
                                <div className="legend-color morning"></div>
                                <span>Morning</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color afternoon"></div>
                                <span>Afternoon</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color evening"></div>
                                <span>Evening</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color night"></div>
                                <span>Night</span>
                            </div>
                        </div>
                        
                        <div className="days-tabs">
                            {weekdays.map(day => (
                                <div 
                                    key={day} 
                                    className={`day-tab ${selectedDay === day ? 'active' : ''}`}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </div>
                            ))}
                        </div>
                        
                        <div className="slots-container">
                            {/* Morning Time Slots */}
                            <div className="time-period-container">
                                <div className="time-period-label">Morning (6 AM - 12 PM)</div>
                                <div className="slot-checkboxes">
                                    {timeSlots.filter(slot => slot.timeOfDay === 'morning').map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`slot-label slot-morning ${isSlotSelected(selectedDay, slot.id) ? 'selected' : ''}`}
                                            onClick={() => handleCheckboxChange(slot.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSlotSelected(selectedDay, slot.id)}
                                                onChange={() => handleCheckboxChange(slot.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <span className="slot-time">{slot.display}</span>
                                            <span className="slot-period">{slot.period}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Afternoon Time Slots */}
                            <div className="time-period-container">
                                <div className="time-period-label">Afternoon (12 PM - 5 PM)</div>
                                <div className="slot-checkboxes">
                                    {timeSlots.filter(slot => slot.timeOfDay === 'afternoon').map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`slot-label slot-afternoon ${isSlotSelected(selectedDay, slot.id) ? 'selected' : ''}`}
                                            onClick={() => handleCheckboxChange(slot.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSlotSelected(selectedDay, slot.id)}
                                                onChange={() => handleCheckboxChange(slot.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <span className="slot-time">{slot.display}</span>
                                            <span className="slot-period">{slot.period}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Evening Time Slots */}
                            <div className="time-period-container">
                                <div className="time-period-label">Evening (5 PM - 9 PM)</div>
                                <div className="slot-checkboxes">
                                    {timeSlots.filter(slot => slot.timeOfDay === 'evening').map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`slot-label slot-evening ${isSlotSelected(selectedDay, slot.id) ? 'selected' : ''}`}
                                            onClick={() => handleCheckboxChange(slot.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSlotSelected(selectedDay, slot.id)}
                                                onChange={() => handleCheckboxChange(slot.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <span className="slot-time">{slot.display}</span>
                                            <span className="slot-period">{slot.period}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Night Time Slots */}
                            <div className="time-period-container">
                                <div className="time-period-label">Night (9 PM - 6 AM)</div>
                                <div className="slot-checkboxes">
                                    {timeSlots.filter(slot => slot.timeOfDay === 'night').map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`slot-label slot-night ${isSlotSelected(selectedDay, slot.id) ? 'selected' : ''}`}
                                            onClick={() => handleCheckboxChange(slot.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSlotSelected(selectedDay, slot.id)}
                                                onChange={() => handleCheckboxChange(slot.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <span className="slot-time">{slot.display}</span>
                                            <span className="slot-period">{slot.period}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <button className="update-schedule-button" onClick={handleScheduleUpdate}>
                            <i className="fas fa-save"></i> Update Schedule
                        </button>
                        
                        <div className="availability-summary">
                            <h4>Your Current Schedule</h4>
                            {Object.keys(availabilityByDay).some(day => Array.isArray(availabilityByDay[day]) && availabilityByDay[day].length > 0) ? (
                                <div className="day-schedules">
                                    {Object.keys(availabilityByDay).map(day => 
                                        Array.isArray(availabilityByDay[day]) && availabilityByDay[day].length > 0 && (
                                            <div key={day} className="day-schedule">
                                                <h5>{day.charAt(0).toUpperCase() + day.slice(1)}</h5>
                                                <ul className="schedule-list">
                                                    {availabilityByDay[day].map(slotId => {
                                                        const slot = getSlotById(slotId);
                                                        return slot ? (
                                                            <li key={slotId}>
                                                                <span className="slot-time-info">{slot.display} {slot.period}</span>
                                                                <span className={`slot-chip ${slot.timeOfDay}`}>
                                                                    {slot.timeOfDay.charAt(0).toUpperCase() + slot.timeOfDay.slice(1)}
                                                                </span>
                                                            </li>
                                                        ) : null;
                                                    })}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="empty-schedule">
                                    <p>No availability set</p>
                                    <p>Select time slots for each day to let patients know when you're available</p>
                                </div>
                            )}
                        </div>
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
                        <button onClick={handleFeedbackSubmit} className="submit-feedback-button">
                            <i className="fas fa-paper-plane"></i> Submit Feedback
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;