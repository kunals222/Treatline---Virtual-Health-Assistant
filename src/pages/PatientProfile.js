import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePatientProfile, fetchPatientDetails } from '../redux/slices/authSlice';
import '../styles/PatientProfile.css';

const PatientProfile = () => {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        gender: '',
        address: '',
        medicalHistory: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        allergies: '',
        dateOfBirth: '',
        familyMembers: [{ name: '', relation: '', phone: '', email: '', dateOfBirth: '' }],
    });

    useEffect(() => {
        dispatch(fetchPatientDetails());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                phone: user.phone || '',
                age: user.age || '',
                gender: user.gender || '',
                address: user.address || '',
                medicalHistory: user.medicalHistory || '',
                emergencyContactName: user.emergencyContact?.name || '',
                emergencyContactPhone: user.emergencyContact?.phone || '',
                allergies: user.allergies || '',
                dateOfBirth: user.dateOfBirth || '',
                familyMembers: user.familyMembers || [{ name: '', relation: '', phone: '', email: '', dateOfBirth: '' }],
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

    const handleFamilyMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFamilyMembers = formData.familyMembers.map((member, i) => 
            i === index ? { ...member, [name]: value } : member
        );
        setFormData({ ...formData, familyMembers: updatedFamilyMembers });
    };

    const addFamilyMember = () => {
        setFormData({
            ...formData,
            familyMembers: [...formData.familyMembers, { name: '', relation: '', phone: '', email: '', dateOfBirth: '' }]
        });
    };

    const handleRemoveFamilyMember = (index) => {
        const updatedFamilyMembers = [...formData.familyMembers];
        updatedFamilyMembers.splice(index, 1);
        setFormData({ ...formData, familyMembers: updatedFamilyMembers });
    };

    const handleSave = () => {
        setIsEditing(!isEditing);

        if (hasChanges()) {
            const updatedData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'familyMembers') {
                    formData.familyMembers.forEach((member, index) => {
                        updatedData.append(`familyMembers[${index}].name`, member.name);
                        updatedData.append(`familyMembers[${index}].relation`, member.relation);
                        updatedData.append(`familyMembers[${index}].phone`, member.phone);
                        updatedData.append(`familyMembers[${index}].email`, member.email);
                        updatedData.append(`familyMembers[${index}].dateOfBirth`, member.dateOfBirth);
                    });
                } else {
                    updatedData.append(key, formData[key]);
                }
            });
            dispatch(updatePatientProfile(updatedData));
            dispatch(fetchPatientDetails());
        }
    };

    const hasChanges = () => {
        return (
            formData.name !== user.name ||
            formData.email !== user.email ||
            formData.phone !== user.phone ||
            formData.age !== user.age ||
            formData.gender !== user.gender ||
            formData.address !== user.address ||
            formData.medicalHistory !== user.medicalHistory ||
            formData.emergencyContactName !== user.emergencyContact?.name ||
            formData.emergencyContactPhone !== user.emergencyContact?.phone ||
            formData.allergies !== user.allergies ||
            formData.dateOfBirth !== user.dateOfBirth ||
            JSON.stringify(formData.familyMembers) !== JSON.stringify(user.familyMembers)
        );
    };

    const goingEditing = () => {
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
            </div>
            <div className="profile-section-details">
                {isEditing ? (
                    <>
                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Age:</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Gender:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Medical History:</label>
                        <textarea
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Emergency Contact Name:</label>
                        <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Emergency Contact Phone:</label>
                        <input
                            type="text"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Allergies:</label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="profile-section-input"
                        />
                        <label>Family Members:</label>
                        {formData.familyMembers.map((member, index) => (
                            <div key={index} className="family-member">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={member.name}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="profile-section-input"
                                    required
                                />
                                <select
                                    name="relation"
                                    value={member.relation}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="profile-section-input"
                                    required
                                >
                                    <option value="">Relation</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={member.phone}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="profile-section-input"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={member.email}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="profile-section-input"
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={member.dateOfBirth}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    className="profile-section-input"
                                />
                                <button onClick={() => handleRemoveFamilyMember(index)} className="remove-family-member">Remove</button>
                            </div>
                        ))}
                        <button onClick={addFamilyMember} className="add-family-member">Add Family Member</button>
                    </>
                ) : (
                    <>
                        <p><strong>Phone:</strong> {user?.phone}</p>
                        <p><strong>Age:</strong> {user?.age}</p>
                        <p><strong>Gender:</strong> {user?.gender}</p>
                        <p><strong>Address:</strong> {user?.address}</p>
                        <p><strong>Medical History:</strong> {user?.medicalHistory}</p>
                        <p><strong>Emergency Contact Name:</strong> {user?.emergencyContact?.name}</p>
                        <p><strong>Emergency Contact Phone:</strong> {user?.emergencyContact?.phone}</p>
                        <p><strong>Allergies:</strong> {user?.allergies}</p>
                        <p><strong>Date of Birth:</strong> {user?.dateOfBirth}</p>
                        <p><strong>Family Members:</strong></p>
                        {user?.familyMembers?.map((member, index) => (
                            <div key={index} className="family-member">
                                <p><strong>Name:</strong> {member.name}</p>
                                <p><strong>Relation:</strong> {member.relation}</p>
                                <p><strong>Phone:</strong> {member.phone}</p>
                                <p><strong>Email:</strong> {member.email}</p>
                                <p><strong>Date of Birth:</strong> {member.dateOfBirth}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
            
            {loading && <p>Loading...</p>}
            {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

            <div className="profile-section-edit">
                {isEditing ? (
                    <button onClick={handleSave} className="profile-section-button">
                        Save
                    </button>
                ) : (
                    <button onClick={goingEditing} className="profile-section-button">
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default PatientProfile;