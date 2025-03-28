import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableDoctors, bookAppointment } from '../redux/slices/appointmentSlice';
import '../styles/BookAppointment.css';


const BookAppointment = () => {
    const [symptoms, setSymptoms] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [language, setLanguage] = useState('');
    const [notes, setNotes] = useState('none');
    const dispatch = useDispatch();
    const { availableDoctors, loading, error, priority_score } = useSelector((state) => state.appointments);



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

    const handleSearch = () => {
        const timeSlot = timeSlots.indexOf(selectedSlot);
        dispatch(fetchAvailableDoctors({ symptoms, timeSlot, language }));
    };

    // const goToCashfree = () => {
    //     navigate('/CashfreePayment'); // Navigate to ScreenB
    // };

    const handleBookAppointment = (doctorId) => {

        const timeSlot = timeSlots.indexOf(selectedSlot);
        console.log({ doctorId, symptoms, selectedSlot, priority_score, language, notes });
        dispatch(bookAppointment({ doctorId, symptoms, timeSlot, priority_score, language, notes }));

        // goToCashfree(); // Call the function to navigate to ScreenB
    };

    return (
        <div className="book-appointment-container">
            <h2>Book an Appointment</h2>
            <div className="form-group">
                <label htmlFor="symptoms">Symptoms</label>
                <textarea
                    id="symptoms"
                    name="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="timeSlot">Time Slot</label>
                <select
                    id="timeSlot"
                    name="timeSlot"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    required
                >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>{slot}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="language">Preferred Language</label>
                <input
                    type="text"
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Enter preferred language"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional notes (optional)"
                />
            </div>
            <button onClick={handleSearch} className="search-button">Search Doctors</button>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

            {availableDoctors?.length > 0 && (
                <div className="doctor-list">
                    <h3>Available Doctors</h3>
                    {availableDoctors?.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                            <img src={doctor.profile_image} alt={`${doctor.name}'s profile`} className="doctor-profile-image" />
                            <h4>{doctor.name}</h4>
                            <p><strong>Specialization:</strong> {doctor.specialist}</p>
                            <p><strong>Specialist Degree:</strong> {doctor.specialistDegree}</p>
                            <p><strong>Languages:</strong> {doctor.language.join(', ')}</p>
                            <p><strong>Phone:</strong> {doctor.phone}</p>
                            <p><strong>Years of Experience:</strong> {doctor.years_of_experience}</p>
                            <p><strong>Medical Registration ID:</strong> {doctor.medical_registration_id}</p>
                            <button onClick={() => handleBookAppointment(doctor._id)} className="book-button">Book Appointment</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookAppointment;