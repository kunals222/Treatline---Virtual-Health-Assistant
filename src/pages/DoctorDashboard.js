import React, { useState, useEffect } from 'react';
import '../styles/DoctorDashboard.css';
import Profile from '../pages/Profile.js';
import PatientProfile from './PatientProfile.js';
import BookAppointment from './BookAppointment.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorProfile, updateDoctorSchedule, fetchAppointments, fetchPatientDetails, submitFeedback } from '../redux/slices/authSlice';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/Prescription.css';

const DoctorDashboard = () => {
    const [activeSection, setActiveSection] = useState('scheduled');
    const [feedback, setFeedback] = useState('');
    const dispatch = useDispatch();
    const { user, loading, error, pastAppointments, currentAppointments, role, appointment } = useSelector((state) => state.auth);
    const [selectedSlots, setSelectedSlots] = useState([]);
    
    // Prescription related state
    const [prescriptionData, setPrescriptionData] = useState({
        patientName: '',
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        specialInstructions: '',
        appointmentId: '',
        date: new Date().toLocaleDateString()
    });
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]); // Mock data storage - would be replaced by API calls

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
        dispatch(updateDoctorSchedule(updatedTimeSlot)).unwrap()
            .then(() => {
                toast.success('Schedule updated successfully!');
            })
            .catch((error) => {
                toast.error('Failed to update schedule.');
            });
    };

    const handleFeedbackSubmit = () => {
        dispatch(submitFeedback({ feedback })).unwrap()
            .then(() => {
                toast.success('Feedback submitted successfully!');
            })
            .catch((error) => {
                toast.error('Failed to submit feedback.');
            });
        setFeedback('');
    };

    const openPrescriptionModal = (appt) => {
        setPrescriptionData({
            ...prescriptionData,
            patientName: appt.patientName,
            appointmentId: appt._id,
            date: new Date().toLocaleDateString()
        });
        setShowPrescriptionModal(true);
    };

    const handlePrescriptionFormChange = (e) => {
        const { name, value } = e.target;
        setPrescriptionData({
            ...prescriptionData,
            [name]: value
        });
    };

    const savePrescription = () => {
        const newPrescription = {
            ...prescriptionData,
            doctorName: user?.name || 'Doctor',
            id: Date.now().toString(),
        };
        
        setPrescriptions([...prescriptions, newPrescription]);
        toast.success('Prescription saved successfully!');
        setShowPrescriptionModal(false);
        
        setPrescriptionData({
            patientName: '',
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            specialInstructions: '',
            appointmentId: '',
            date: new Date().toLocaleDateString()
        });
    };

    const handleDownloadPrescription = (prescription) => {
        const prescriptionText = `
            TREATLINE PRESCRIPTION
            ---------------------
            
            Doctor: ${prescription.doctorName}
            Patient: ${prescription.patientName}
            Date: ${prescription.date}
            
            Medication: ${prescription.medication}
            Dosage: ${prescription.dosage}
            Frequency: ${prescription.frequency}
            Duration: ${prescription.duration}
            
            Special Instructions:
            ${prescription.specialInstructions}
        `;
        
        const element = document.createElement("a");
        const file = new Blob([prescriptionText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.date.replace(/\//g, '-')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleJoinMeeting = (appointmentId) => {
        const meetingUrl = `https://treatline.duckdns.org/${appointmentId}`;
        window.open(meetingUrl, '_blank');
    };

    return (
        <div className="dashboard">
        <ToastContainer position="top-right" autoClose={3000} />
            <div className="sidebar">
                {role === 'doctor' && (
                    <>
                        <button onClick={() => setActiveSection('scheduled')}>Upcoming Appointments</button>
                        <button onClick={() => setActiveSection('history')}>Appointment History</button>
                        <button onClick={() => setActiveSection('availability')}>Manage Availability</button>
                        <button onClick={() => setActiveSection('prescriptions')}>Prescriptions</button>
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
                        <button onClick={() => setActiveSection('prescriptions')}>My Prescriptions</button>
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
                                <div className="appointment-actions">
                                    <button className="join-meeting-button" onClick={() => handleJoinMeeting(appt._id)}>
                                        <span className="button-icon"></span> Join Meeting
                                    </button>
                                    <button className="write-prescription-button" onClick={() => openPrescriptionModal(appt)}>
                                        <span className="button-icon"></span> Write Prescription
                                    </button>
                                </div>
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
                {role === 'doctor' && activeSection === 'prescriptions' && (
                    <div className="prescriptions-section">
                        <h2>Issued Prescriptions</h2>
                        <div className="prescriptions-list">
                            {prescriptions.length > 0 ? (
                                prescriptions.map((prescription, index) => (
                                    <div className="prescription-item" key={index}>
                                        <div className="prescription-header">
                                            <h3>{prescription.patientName}</h3>
                                            <span>{prescription.date}</span>
                                        </div>
                                        <div className="prescription-details">
                                            <p><strong>Medication:</strong> {prescription.medication}</p>
                                            <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                            <p><strong>Frequency:</strong> {prescription.frequency}</p>
                                            <p><strong>Duration:</strong> {prescription.duration}</p>
                                            <p><strong>Instructions:</strong> {prescription.specialInstructions}</p>
                                        </div>
                                        <button 
                                            className="download-prescription-button"
                                            onClick={() => handleDownloadPrescription(prescription)}
                                        >
                                            <span className="button-icon">📄</span> Download
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="no-prescriptions">No prescriptions have been issued yet.</p>
                            )}
                        </div>
                    </div>
                )}
                {role === 'patient' && activeSection === 'prescriptions' && (
                    <div className="prescriptions-section">
                        <h2>My Prescriptions</h2>
                        <div className="prescriptions-list">
                            {prescriptions.filter(p => p.patientName === user?.name).length > 0 ? (
                                prescriptions.filter(p => p.patientName === user?.name).map((prescription, index) => (
                                    <div className="prescription-item" key={index}>
                                        <div className="prescription-header">
                                            <h3>From: Dr. {prescription.doctorName}</h3>
                                            <span>{prescription.date}</span>
                                        </div>
                                        <div className="prescription-details">
                                            <p><strong>Medication:</strong> {prescription.medication}</p>
                                            <p><strong>Dosage:</strong> {prescription.dosage}</p>
                                            <p><strong>Frequency:</strong> {prescription.frequency}</p>
                                            <p><strong>Duration:</strong> {prescription.duration}</p>
                                            <p><strong>Instructions:</strong> {prescription.specialInstructions}</p>
                                        </div>
                                        <button 
                                            className="download-prescription-button"
                                            onClick={() => handleDownloadPrescription(prescription)}
                                        >
                                            <span className="button-icon">📄</span> Download
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="no-prescriptions">You have no prescriptions yet.</p>
                            )}
                        </div>
                    </div>
                )}
                {showPrescriptionModal && (
                    <div className="modal-overlay">
                        <div className="prescription-modal">
                            <h2>Write Prescription</h2>
                            <button 
                                className="close-modal-button"
                                onClick={() => setShowPrescriptionModal(false)}
                            >×</button>
                            
                            <div className="prescription-form">
                                <div className="form-group">
                                    <label>Patient Name:</label>
                                    <input 
                                        type="text" 
                                        name="patientName" 
                                        value={prescriptionData.patientName} 
                                        readOnly 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Medication:</label>
                                    <input 
                                        type="text" 
                                        name="medication" 
                                        value={prescriptionData.medication} 
                                        onChange={handlePrescriptionFormChange} 
                                        placeholder="Enter medication name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Dosage:</label>
                                    <input 
                                        type="text" 
                                        name="dosage" 
                                        value={prescriptionData.dosage} 
                                        onChange={handlePrescriptionFormChange} 
                                        placeholder="e.g., 500mg"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Frequency:</label>
                                    <input 
                                        type="text" 
                                        name="frequency" 
                                        value={prescriptionData.frequency} 
                                        onChange={handlePrescriptionFormChange} 
                                        placeholder="e.g., Twice daily"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Duration:</label>
                                    <input 
                                        type="text" 
                                        name="duration" 
                                        value={prescriptionData.duration} 
                                        onChange={handlePrescriptionFormChange} 
                                        placeholder="e.g., 7 days"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Special Instructions:</label>
                                    <textarea 
                                        name="specialInstructions" 
                                        value={prescriptionData.specialInstructions} 
                                        onChange={handlePrescriptionFormChange} 
                                        placeholder="Enter any special instructions"
                                    />
                                </div>

                                <button 
                                    className="save-prescription-button"
                                    onClick={savePrescription}
                                >
                                    <span className="button-icon">💾</span> Save Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
