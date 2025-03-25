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
        if (files) {
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(files[0]);
            setFormData({
                ...formData,
                [name]: files[0],
                profile_image_url: previewUrl
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
        setIsEditing(!isEditing);
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="profile-title">Doctor Profile</h1>
            </div>
            
            <div className="profile-content">
                <div className="profile-image-section">
                    <div className="profile-image-container">
                        <img
                            src={formData.profile_image_url}
                            alt="Doctor Profile"
                            className="profile-image"
                        />
                        {isEditing && (
                            <div className="profile-image-overlay">
                                <label htmlFor="profile-image-input" className="image-upload-label">
                                    ✏️ Change Photo
                                </label>
                                <input
                                    id="profile-image-input"
                                    type="file"
                                    name="profile_image"
                                    onChange={handleInputChange}
                                    className="profile-image-input"
                                />
                            </div>
                        )}
                    </div>
                    <div className="profile-name-section">
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="profile-input name-input"
                                placeholder="Your Name"
                            />
                        ) : (
                            <h2 className="profile-name">{user?.name}</h2>
                        )}
                        <p className="profile-email">✉️ {user?.email}</p>
                    </div>
                </div>
                
                <div className="profile-details-section">
                    <div className="profile-card">
                        <h3 className="section-title">Professional Information</h3>
                        <div className="profile-field">
                            <div className="field-label">🩺 Specialist Degree</div>
                            <div className="field-value">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="specialistDegree"
                                        value={formData.specialistDegree}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Your Specialization"
                                    />
                                ) : (
                                    <span>{user?.specialistDegree || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">🗣️ Languages</div>
                            <div className="field-value">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="languages"
                                        value={formData.languages}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Languages you speak"
                                    />
                                ) : (
                                    <span>{user?.language || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">📅 Experience</div>
                            <div className="field-value">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Years of experience"
                                    />
                                ) : (
                                    <span>{user?.years_of_experience || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="profile-card">
                        <h3 className="section-title">Contact & Verification</h3>
                        <div className="profile-field">
                            <div className="field-label">📞 Phone</div>
                            <div className="field-value">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Your phone number"
                                    />
                                ) : (
                                    <span>{user?.phone || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="profile-field">
                            <div className="field-label">🆔 Medical Registration ID</div>
                            <div className="field-value">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="medical_registration_id"
                                        value={formData.medical_registration_id}
                                        onChange={handleInputChange}
                                        className="profile-input"
                                        placeholder="Medical license number"
                                    />
                                ) : (
                                    <span>{user?.medical_registration_id || "Not specified"}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="profile-card">
                        <h3 className="section-title">🎓 Certificates</h3>
                        {isEditing ? (
                            <div className="certificates-section">
                                {formData.certificates.map((certificate, index) => (
                                    <div key={index} className="certificate-item">
                                        <span className="certificate-label">Certificate #{index + 1}</span>
                                        <button 
                                            onClick={() => handleRemoveCertificate(index)} 
                                            className="remove-certificate-btn"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button onClick={handleAddCertificate} className="add-certificate-btn">
                                    Add Certificate
                                </button>
                            </div>
                        ) : (
                            <div className="certificates-list">
                                {user?.certificates && user.certificates.length > 0 ? (
                                    user.certificates.map((cert, index) => (
                                        <div key={index} className="certificate-item-display">
                                            <span>Certificate #{index + 1}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="no-certificates">No certificates added</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {loading && <div className="loading-overlay"><span>Loading...</span></div>}
                
                {error && (
                    <div className="error-message">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </div>
                )}
                
                <div className="profile-actions">
                    {isEditing ? (
                        <button onClick={handleSave} className="save-button">
                            💾 Save Changes
                        </button>
                    ) : (
                        <button onClick={goingEditing} className="edit-button">
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
