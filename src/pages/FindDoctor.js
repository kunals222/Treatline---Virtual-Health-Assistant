import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoctors } from '../redux/slices/authSlice';
import '../styles/FindDoctor.css';

const FindDoctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const { doctors, loading, error } = useSelector((state) => state.auth); // Access doctors from Redux state

    useEffect(() => {
        // Fetch all doctors when the component loads
        dispatch(fetchAllDoctors());
        console.log(doctors);
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    // Filter doctors based on the search term (name, email, or specialist)
    const filteredDoctors = doctors?.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="find-doctor-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email, or specialist"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <div className="doctor-list">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {filteredDoctors?.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                            <img src={doctor.profile_image} alt={`${doctor.name}'s profile`} className="doctor-image" />
                            <h3>{doctor.name}</h3>
                            <p><strong>Email:</strong> {doctor.email}</p>
                            <p><strong>Specialist:</strong> {doctor.specialist}</p>
                            <button className="book-appointment-button">Book Appointment</button>
                        </div>
                    ))
                ) : (
                    !loading && <p>No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default FindDoctor;