import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoctors } from '../redux/slices/authSlice';
import '../styles/FindDoctor.css';

import { useNavigate } from 'react-router-dom';

const FindDoctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // const [selectedDoctor, setSelectedDoctor] = useState(null); // Track the selected doctor
    
    const dispatch = useDispatch();
    const { doctors, loading, error } = useSelector((state) => state.auth); // Access doctors from Redux state
    
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all doctors when the component loads
        dispatch(fetchAllDoctors());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

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
                            <button
                                        onClick={() =>
                                            navigate(`/doctor/${doctor._id}`)
                                        }
                                        className="view-profile-button"
                                    >
                                        View Profile
                                    </button>
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