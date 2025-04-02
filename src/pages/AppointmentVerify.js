import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAppointmentDetails } from '../redux/slices/appointmentSlice';
import '../styles/AppointmentVerify.css';

const AppointmentVerify = () => {
    const { appointmentID } = useParams(); // Get the appointment ID from the URL
    
    const dispatch = useDispatch();
    const { appointmentDetails: appointment, error } = useSelector((state) => state.appointments);

    useEffect(() => {
        // Fetch appointment details from the backend
        dispatch(fetchAppointmentDetails(appointmentID));
    }, [dispatch, appointmentID]);

    return (
        <div className="appointment-verify-container">
            <div className="card">
                {error ? (
                    <h2 className="error">No appointment found or invalid.</h2>
                ) : !appointment ? (
                    <h2 className="loading">Loading...</h2>
                ) : (
                    <div>
                        <h1 className="verified-title">✅ Verified Appointment</h1>
                        <p className="issued-by">Issued by TreatLine</p>
                        <hr className="divider" />

                        <h2>🩺 Doctor: {appointment.doctorName}</h2>
                        <h3>👤 Patient: {appointment.patientName}</h3>
                        <h4>📅 Date: {new Date(appointment.start).toLocaleDateString()}</h4>

                        <div className="prescription-box">
                            <h3>💊 Prescription:</h3>
                            {appointment.prescription && appointment.prescription.medications.length > 0 ? (
                                <ul>
                                    {appointment.prescription.medications.map((med, index) => (
                                        <li key={index}>
                                            <b>{med.name}</b> - {med.dosage}, {med.frequency}, {med.duration}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No prescription available for this appointment.</p>
                            )}

                            {appointment.prescription?.additionalInstructions && (
                                <p>
                                    <b>⚠️ Instructions:</b> {appointment.prescription.additionalInstructions}
                                </p>
                            )}
                        </div>

                        <button onClick={() => window.print()} className="download-button">
                            📄 Download PDF
                        </button>

                        <footer>
                            🔗 <a href="https://www.treatline.com">www.treatline.com</a> | 📞 +91-XXXXX-XXXXX
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentVerify;