import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/slices/authSlice';
import '../styles/DoctorRegistration.css';

const DoctorRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialistDegree: '',
        languages: '',
        experience: '',
        phone: '',
        medical_registration_id: '',
        profile_image: null,
        certificates: [],
        medical_license: null,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            // Handle multiple files for certificates
            if (name === 'certificates') {
                setFormData({
                    ...formData,
                    [name]: Array.from(files),
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: files[0],
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('specialistDegree', formData.specialistDegree);
        data.append('languages', formData.languages);
        data.append('experience', formData.experience);
        data.append('phone', formData.phone);
        data.append('medical_registration_id', formData.medical_registration_id);
        
        // Profile Image
        if (formData.profile_image) {
            data.append('profile_image', formData.profile_image);
        }

        // Medical License
        if (formData.medical_license) {
            data.append('medical_license', formData.medical_license);
        }

        // Certificates (multiple files)
        formData.certificates.forEach((file) => {
            data.append('certificates', file);
        });

        try {
            await dispatch(registerUser(data)).unwrap();
            alert('Registration Successful!');
            navigate('/');  // Redirect to home page
        } catch (err) {
            alert('Registration Failed! Please try again.');
            console.error('Error during registration:', err);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2>Doctor Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="specialistDegree">Specialist Degree</label>
                    <input
                        type="text"
                        id="specialistDegree"
                        name="specialistDegree"
                        placeholder="Enter your specialist degree"
                        value={formData.specialistDegree}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="languages">Languages</label>
                    <input
                        type="text"
                        id="languages"
                        name="languages"
                        placeholder="Enter languages (comma-separated)"
                        value={formData.languages}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="experience">Years of Experience</label>
                    <input
                        type="number"
                        id="experience"
                        name="experience"
                        placeholder="Enter your years of experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="medical_registration_id">Medical Registration ID</label>
                    <input
                        type="text"
                        id="medical_registration_id"
                        name="medical_registration_id"
                        placeholder="Enter your medical registration ID"
                        value={formData.medical_registration_id}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="profile_image">Profile Image</label>
                    <input
                        type="file"
                        id="profile_image"
                        name="profile_image"
                        accept="image/*"
                        onChange={handleInputChange}
                    />

                    <label htmlFor="medical_license">Medical License</label>
                    <input
                        type="file"
                        id="medical_license"
                        name="medical_license"
                        accept=".pdf,.jpg,.png"
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="certificates">Certificates</label>
                    <input
                        type="file"
                        id="certificates"
                        name="certificates"
                        accept=".pdf,.jpg,.png"
                        multiple
                        onChange={handleInputChange}
                    />

                    {loading && <p>Registering...</p>}
                    {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistration;
