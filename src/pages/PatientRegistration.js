import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerPatient } from '../redux/slices/authSlice'; // Assuming you have a registerPatient action
import '../styles/PatientRegistration.css';
import logo from '../assets/logo1.png';
import Footer from '../components/Footer';

const PatientRegistration = () => {
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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data for file upload
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('phone', formData.phone);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('address', formData.address);
        data.append('medicalHistory', formData.medicalHistory);
        data.append('emergencyContact.name', formData.emergencyContactName);
        data.append('emergencyContact.phone', formData.emergencyContactPhone);
        data.append('allergies', formData.allergies);
        data.append('dateOfBirth', formData.dateOfBirth);

        // Family Members
        formData.familyMembers.forEach((member, index) => {
            data.append(`familyMembers[${index}].name`, member.name);
            data.append(`familyMembers[${index}].relation`, member.relation);
            data.append(`familyMembers[${index}].phone`, member.phone);
            data.append(`familyMembers[${index}].email`, member.email);
            data.append(`familyMembers[${index}].dateOfBirth`, member.dateOfBirth);
        });

        // for (const [key, value] of data.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        try {
            await dispatch(registerPatient(data)).unwrap();
            alert('Registration Successful!');
            navigate('/');  // Redirect to home page
        } catch (err) {
            alert('Registration Failed! Please try again.');
            console.error('Error during registration:', err);
        }
    };

    return (
        <>

            <div className="registration-container">
                <div className="registration-card">
                    <div className="branding">
                        <img src={logo} alt="TreatLine" />
                        <h1>TreatLine</h1>
                    </div>
                    <h2>Patient Registration</h2>
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

                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="medicalHistory">Medical History</label>
                        <textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            placeholder="Enter your medical history"
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                        <input
                            type="text"
                            id="emergencyContactName"
                            name="emergencyContactName"
                            placeholder="Enter emergency contact name"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                        <input
                            type="text"
                            id="emergencyContactPhone"
                            name="emergencyContactPhone"
                            placeholder="Enter emergency contact phone"
                            value={formData.emergencyContactPhone}
                            onChange={handleInputChange}
                            required
                        />

                        

                        <label htmlFor="allergies">Allergies</label>
                        <input
                            type="text"
                            id="allergies"
                            name="allergies"
                            placeholder="Enter any allergies"
                            value={formData.allergies}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="familyMembers">Family Members</label>
                        {formData.familyMembers.map((member, index) => (
                            <div key={index} className="family-member">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={member.name}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                    required
                                />
                                <select
                                    name="relation"
                                    value={member.relation}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
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
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={member.email}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={member.dateOfBirth}
                                    onChange={(e) => handleFamilyMemberChange(index, e)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addFamilyMember}>Add Family Member</button>

                        {loading && <p>Registering...</p>}
                        {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

                        <button type="submit">Register</button>
                    </form>
                    <div className="login-register-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientRegistration;