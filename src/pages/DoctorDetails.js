import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleDoctor } from '../redux/slices/authSlice';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/DoctorDetails.css';
import { bookAppointment } from '../redux/slices/appointmentSlice';

const DoctorDetails = () => {
    const { doctorId } = useParams(); // Get doctorId from the URL
    const location = useLocation(); // Get state passed from BookAppointment.js
    const dispatch = useDispatch();
    const { priority_score } = useSelector((state) => state.appointments);
    const { doctor, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        symptoms: location.state?.symptoms || '',
        language: location.state?.language || '',
        timeSlot: location.state?.timeSlot || '',
    });

    useEffect(() => {
        // Fetch doctor details when the component loads
        dispatch(fetchSingleDoctor({ doctorId }));
    }, [dispatch, doctorId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleBookAppointment = () => {
        dispatch(
            bookAppointment({
                doctorId,
                symptoms: formData.symptoms,
                timeSlot: formData.timeSlot,
                priority_score,
                language: formData.language,
            })
        )
            .unwrap()
            .then(() => {
                alert('Appointment Query Raised successfully!');
            })
            .catch((err) => {
                alert('Failed to book appointment:', err);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="doctor-details-container">
            {doctor ? (
                <div className="doctor-details-card">
                    <img
                        src={doctor.profile_image}
                        alt={`${doctor.name}'s profile`}
                        className="doctor-profile-image"
                    />
                    <h2>{doctor.name}</h2>
                    <p><strong>Specialization:</strong> {doctor.specialist}</p>
                    <p><strong>Specialist Degree:</strong> {doctor.specialistDegree}</p>
                    <p><strong>Languages:</strong> {doctor.language.join(', ')}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                    <p><strong>Years of Experience:</strong> {doctor.years_of_experience}</p>
                    <p><strong>Medical Registration ID:</strong> {doctor.medical_registration_id}</p>
                    <p><strong>Address:</strong> {doctor.address || 'Not provided'}</p>
                    <p>
                        <strong>Rating:</strong> {doctor.rating.toFixed(1)} ({doctor.rating_count} reviews)
                    </p>

                    <div className="booking-form">
                        <h3>Book Appointment</h3>
                        <div className="form-group">
                            <label htmlFor="symptoms">Symptoms</label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                placeholder="Describe your symptoms"
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="timeSlot">Time Slot</label>
                            <select
                                id="timeSlot"
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Time Slot</option>
                                {doctor.time_slot[0] === 1 && new Date().getTime() < new Date().setHours(2, 30, 0, 0) ? (
                                    <option value="0">0:00 - 3:00</option>
                                ) : null}
                                {doctor.time_slot[1] === 1 && new Date().getTime() < new Date().setHours(5, 30, 0, 0) ? (
                                    <option value="1">3:00 - 6:00</option>
                                ) : null}
                                {doctor.time_slot[2] === 1 && new Date().getTime() < new Date().setHours(8, 30, 0, 0) ? (
                                    <option value="2">6:00 - 9:00</option>
                                ) : null}
                                {doctor.time_slot[3] === 1 && new Date().getTime() < new Date().setHours(11, 30, 0, 0) ? (
                                    <option value="3">9:00 - 12:00</option>
                                ) : null}
                                {doctor.time_slot[4] === 1 && new Date().getTime() < new Date().setHours(14, 30, 0, 0) ? (
                                    <option value="4">12:00 - 15:00</option>
                                ) : null}
                                {doctor.time_slot[5] === 1 && new Date().getTime() < new Date().setHours(17, 30, 0, 0) ? (
                                    <option value="5">15:00 - 18:00</option>
                                ) : null}
                                {doctor.time_slot[6] === 1 && new Date().getTime() < new Date().setHours(20, 30, 0, 0) ? (
                                    <option value="6">18:00 - 21:00</option>
                                ) : null}
                                {doctor.time_slot[7] === 1 && new Date().getTime() < new Date().setHours(23, 30, 0, 0) ? (
                                    <option value="7">21:00 - 24:00</option>
                                ) : null}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="language">Preferred Language</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Language</option>
                                <option value="en">English</option>
                                <option value="mr">Marathi</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                        <button onClick={handleBookAppointment} className="book-button">
                            Book Appointment
                        </button>
                    </div>
                </div>
            ) : (
                <p>No doctor details available.</p>
            )}
        </div>
    );
};

export default DoctorDetails;