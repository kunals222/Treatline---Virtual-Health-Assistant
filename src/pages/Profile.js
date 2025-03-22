import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, fetchDoctorProfile } from '../redux/slices/authSlice';
import '../styles/Profile.css';
import virtualHealthImage from '../assets/doctors-1.jpg';

const Profile = () => {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialistDegree: '',
        languages: '',
        experience: '',
        phone: '',
        medical_registration_id: '',
        profile_image: null,
        profile_image_url: virtualHealthImage,
        certificates: [],
    });

    useEffect(() => {
        dispatch(fetchDoctorProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                specialistDegree: user.specialistDegree || '',
                languages: user.language || '',
                experience: user.years_of_experience || '',
                phone: user.phone || '',
                medical_registration_id: user.medical_registration_id || '',
                profile_image: null,
                profile_image_url: user.profile_image || virtualHealthImage,
                certificates: user.certificates || [],
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleAddCertificate = () => {
        setFormData({
            ...formData,
            certificates: [...formData.certificates, ''],
        });
    };

    const handleRemoveCertificate = (index) => {
        const updatedCertificates = [...formData.certificates];
        updatedCertificates.splice(index, 1);
        setFormData({ ...formData, certificates: updatedCertificates });
    };

    const handleSave = () => {
        setIsEditing(!isEditing);

        if (hasChanges()) {
            const updatedData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'certificates') {
                    formData.certificates.forEach((certificate, index) => {
                        updatedData.append(`certificate_${index}`, certificate);
                    });
                } else {
                    updatedData.append(key, formData[key]);
                }
            });
            dispatch(updateUserProfile(updatedData));
            dispatch(fetchDoctorProfile());
        }
    };

    const hasChanges = () => {
        return (
            formData.name !== user.name ||
            formData.email !== user.email ||
            formData.specialistDegree !== user.specialistDegree ||
            formData.languages !== user.languages ||
            formData.experience !== user.years_of_experience ||
            formData.phone !== user.phone ||
            formData.medical_registration_id !== user.medical_registration_id ||
            formData.profile_image !== user.profile_image
        );
    };

    const goingEditing = () => {
        console.log(formData);
        setIsEditing(!isEditing);
    }

    return (
        <div className="profile-section-container">
            <div className="profile-section-header">
                <div className="profile-section-info">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="profile-section-input"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="profile-section-input"
                                disabled
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="profile-section-name">{user?.name}</h2>
                            <p className="profile-section-email">{user?.email}</p>
                        </>
                    )}
                </div>
                <div className="profile-section-image-container">
                    <img
                        src={formData.profile_image_url}
                        alt="Doctor Profile"
                        className="profile-section-image"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            name="profile_image"
                            onChange={handleInputChange}
                            className="profile-section-image-input"
                        />
                    )}
                </div>
            </div>
            <div className="profile-section-details">
                {isEditing ? (
                    <>
                        <label>Specialist Degree:</label>
                        <input
                            type="text"
                            name="specialistDegree"
                            value={formData.specialistDegree}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Languages:</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Experience:</label>
                        <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Medical Registration ID:</label>
                        <input
                            type="text"
                            name="medical_registration_id"
                            value={formData.medical_registration_id}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />

                        <label>Certificates:</label>
                        {formData.certificates.map((certificate, index) => (
                            <div key={index} className="certificate-item">
                                <label>certificate_url</label>
                                <button onClick={() => handleRemoveCertificate(index)} className="remove-certificate">Remove</button>
                            </div>
                        ))}
                        <button onClick={handleAddCertificate} className="add-certificate">Add Certificate</button>
                    </>
                ) : (
                    <>
                        <p><strong>Specialist Degree:</strong> {user?.specialistDegree}</p>
                        <p><strong>Languages:</strong> {user?.language}</p>
                        <p><strong>Experience:</strong> {user?.years_of_experience}</p>
                        <p><strong>Phone:</strong> {user?.phone}</p>
                        <p><strong>Medical Registration ID:</strong> {user?.medical_registration_id}</p>
                        <p><strong>Certificates:</strong> {user?.certificates?.join(', ') || 'No certificates added.'}</p>
                    </>
                )}
            </div>
            
            {loading && <p>Loading...</p>}
            {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

            <div className="profile-section-edit">
            {isEditing ?
                <button onClick={() => handleSave()} className="profile-section-button">
                    Save 
                </button>
                :
                <button onClick={() => goingEditing()} className="profile-section-button">
                    Edit
                </button>
            }
            </div>
        </div>
    );
};

export default Profile;
