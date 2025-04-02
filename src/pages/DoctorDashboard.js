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
import { fetchPatientAppointments, savePrescription } from '../redux/slices/appointmentSlice.js';
import jsPDF from 'jspdf';
import { fetchAppointmentDetails } from '../redux/slices/appointmentSlice';

const DoctorDashboard = () => {
    const [activeSection, setActiveSection] = useState('scheduled');
    const [feedback, setFeedback] = useState('');
    const dispatch = useDispatch();
    const { user, pastAppointments, currentAppointments, role, appointment } = useSelector((state) => state.auth);
    const {pastApt} = useSelector((state) => state.appointments);
    const [selectedSlots, setSelectedSlots] = useState([]);
    
    // Prescription related state
    const [prescriptionData, setPrescriptionData] = useState({
        medications: [
            {
                name: '',
                dosage: '',
                frequency: '',
                duration: '',
            },
        ],
        additionalInstructions: '',
        appointmentId: '',
        date: new Date().toLocaleDateString(),
    });
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    
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
            dispatch(fetchPatientAppointments());
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

    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...prescriptionData.medications];
        updatedMedications[index][field] = value;
        setPrescriptionData({
            ...prescriptionData,
            medications: updatedMedications,
        });
    };

    const addMedication = () => {
        setPrescriptionData({
            ...prescriptionData,
            medications: [
                ...prescriptionData.medications,
                { name: '', dosage: '', frequency: '', duration: '' },
            ],
        });
    };

    const removeMedication = (index) => {
        const updatedMedications = prescriptionData.medications.filter((_, i) => i !== index);
        setPrescriptionData({
            ...prescriptionData,
            medications: updatedMedications,
        });
    };

    const savePrescriptionHandler = async () => {
        const newPrescription = {
            ...prescriptionData,
            doctorName: user?.name || 'Doctor',
        };

        console.log(newPrescription?.appointmentId);
      
        // Dispatch the savePrescription thunk
        dispatch(
          savePrescription({
            appointmentId: newPrescription.appointmentId,
            medications: newPrescription.medications,
            additionalInstructions: newPrescription.additionalInstructions,
          })
        )
          .unwrap()
          .then(() => {
            toast.success('Prescription saved and sent to backend successfully!');
            setShowPrescriptionModal(false);
      
            // Reset prescription data
            setPrescriptionData({
              medications: [
                {
                  name: '',
                  dosage: '',
                  frequency: '',
                  duration: '',
                },
              ],
              additionalInstructions: '',
              appointmentId: '',
              date: new Date().toLocaleDateString(),
            });
          })
          .catch((error) => {
            console.error('Error sending prescription to backend:', error);
            toast.error('Failed to send prescription to backend.');
          });
      };

    const handleDownloadPrescription = async (appointmentId) => {
        try {
            // Dispatch the Redux action to fetch appointment details
            const resultAction = await dispatch(fetchAppointmentDetails(appointmentId)).unwrap();
            const appointment = resultAction; // Get the fetched appointment details

            if (!appointment.prescription) {
                toast.error('No prescription available for this appointment.');
                return;
            }

            // Generate PDF
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('TREATLINE PRESCRIPTION', 10, 10);
            doc.setFontSize(12);
            doc.text(`Doctor: ${appointment.doctorName}`, 10, 20);
            doc.text(`Patient: ${appointment.patientName}`, 10, 30);
            doc.text(`Date: ${new Date(appointment.start).toLocaleDateString()}`, 10, 40);
            doc.text('----------------------------------------', 10, 50);

            appointment.prescription.medications.forEach((medication, index) => {
                const yPosition = 60 + index * 10;
                doc.text(`Medication: ${medication.name}`, 10, yPosition);
                doc.text(`Dosage: ${medication.dosage}`, 60, yPosition);
                doc.text(`Frequency: ${medication.frequency}`, 110, yPosition);
                doc.text(`Duration: ${medication.duration}`, 160, yPosition);
            });

            doc.text('Special Instructions:', 10, 100);
            doc.text(appointment.prescription.additionalInstructions || 'None', 10, 110);

            // Download the PDF
            doc.save(`prescription_${appointment.patientName.replace(/\s+/g, '_')}_${new Date(appointment.start).toLocaleDateString().replace(/\//g, '-')}.pdf`);
            toast.success('Prescription downloaded successfully!');
        } catch (error) {
            console.error('Error fetching prescription:', error);
            toast.error('Failed to download prescription.');
        }
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
                                <th>Prescription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastAppointments?.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.patientName}</td>
                                    <td>{record.symptoms}</td>
                                    <td>{new Date(record.start).toLocaleDateString()}</td>
                                    <td>{record.notes}</td>
                                    <td>
                                        <button
                                            className="download-prescription-button"
                                            onClick={() => handleDownloadPrescription(record._id)}
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {role === 'patient' && activeSection === 'history' && (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Symptoms</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Prescription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastApt?.length > 0 ? (
                                pastApt.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.doctorName}</td>
                                        <td>{record.symptoms}</td>
                                        <td>{new Date(record.start).toLocaleDateString()}</td>
                                        <td>{record.notes}</td>
                                        <td>
                                            <button
                                                className="download-prescription-button"
                                                onClick={() => handleDownloadPrescription(record._id)}
                                            >
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>
                                        No past appointments found.
                                    </td>
                                </tr>
                            )}
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
               
                {showPrescriptionModal && (
                    <div className="modal-overlay">
                        <div className="prescription-modal">
                            <h2>Write Prescription</h2>
                            <button 
                                className="close-modal-button"
                                onClick={() => setShowPrescriptionModal(false)}
                            >×</button>
                            
                            <div className="prescription-form">
                                {prescriptionData.medications.map((medication, index) => (
                                    <div key={index} className="medication-group">
                                        <div className="form-group">
                                            <label>Medication Name:</label>
                                            <input
                                                type="text"
                                                value={medication.name}
                                                onChange={(e) =>
                                                    handleMedicationChange(index, 'name', e.target.value)
                                                }
                                                placeholder="Enter medication name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Dosage:</label>
                                            <input
                                                type="text"
                                                value={medication.dosage}
                                                onChange={(e) =>
                                                    handleMedicationChange(index, 'dosage', e.target.value)
                                                }
                                                placeholder="e.g., 500mg"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Frequency:</label>
                                            <input
                                                type="text"
                                                value={medication.frequency}
                                                onChange={(e) =>
                                                    handleMedicationChange(index, 'frequency', e.target.value)
                                                }
                                                placeholder="e.g., Twice daily"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Duration:</label>
                                            <input
                                                type="text"
                                                value={medication.duration}
                                                onChange={(e) =>
                                                    handleMedicationChange(index, 'duration', e.target.value)
                                                }
                                                placeholder="e.g., 7 days"
                                            />
                                        </div>
                                        <button
                                            className="remove-medication-button"
                                            onClick={() => removeMedication(index)}
                                        >
                                            Remove Medication
                                        </button>
                                    </div>
                                ))}
                                <button className="add-medication-button" onClick={addMedication}>
                                    Add Medication
                                </button>

                                <div className="form-group">
                                    <label>Additional Instructions:</label>
                                    <textarea
                                        value={prescriptionData.additionalInstructions}
                                        onChange={(e) =>
                                            setPrescriptionData({
                                                ...prescriptionData,
                                                additionalInstructions: e.target.value,
                                            })
                                        }
                                        placeholder="Enter any additional instructions"
                                    />
                                </div>

                                <button 
                                    className="save-prescription-button"
                                    onClick={savePrescriptionHandler}
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
