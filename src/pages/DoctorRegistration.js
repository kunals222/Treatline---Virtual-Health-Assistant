import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/slices/authSlice';
import '../styles/DoctorRegistration.css';
import logo from '../assets/logo1.png';
import Footer from '../components/Footer';
// import axios from 'axios';
// import { load } from '@cashfreepayments/cashfree-js'


const specialists = [
    'Psychiatrist', 'ENT Specialist', 'Endocrinologist', 'Urologist',
    'Toxicologist', 'Gynecologist', 'Orthopedic Surgeon', 'Dentist',
    'Ophthalmologist', 'Neurologist', 'Pediatric Surgeon',
    'Cardiologist', 'Nephrologist', 'Pain Management Specialist',
    'Obstetrician', 'Oncologist', 'Pulmonologist', 'Traumatologist',
    'Gastroenterologist', 'Hepatologist', 'Rheumatologist',
    'Geneticist', 'General Surgeon', 'Vascular Surgeon',
    'Infectious Disease Specialist', 'Pediatrician', 'Podiatrist',
    'Dermatologist', 'Hematologist', 'Nutritionist',
    'Sleep Medicine Specialist', 'General Practitioner',
    'Oral Surgeon', 'Emergency Medicine Specialist',
    'ENT SpecialistOt', 'Allergist', 'Addiction Specialist',
    'Psychologist', 'Developmental Pediatrician', 'Trauma Surgeon',
    'Wound Care Specialist', 'Otolaryngologist',
    'Pediatric Pulmonologist', 'Immunologist', 'Vascular specialist',
    'Infectious disease specialist', 'Orthopedic specialist',
    'Oral surgeon', 'Plastic surgeon', 'General surgeon',
    'Emergency medicine specialist', 'Obstetrician-Gynecologist',
    'Vascular surgeon', 'Neurosurgeon', 'Proctologist',
    'ENT specialist', 'Burn specialist',
    'Oral and maxillofacial surgeon', 'medical oncologist',
    'Orthopedic Specialist', 'infectious disease specialists.',
    'General Physician'
];

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
        specialist: '', // Add specialist to formData
        sponsored: false, // Add sponsored field to formData
    });

    const [filteredSpecialists, setFilteredSpecialists] = useState(specialists);
    const [selectedSpecialist, setSelectedSpecialist] = useState('');
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
    const [specialistError, setSpecialistError] = useState(''); // State to handle specialist error

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (type === 'checkbox') {
            // Handle checkbox input
            setFormData({
                ...formData,
                [name]: checked,
            });

            // if (name === 'sponsored' && checked) {
            //     // handleSponsoredClick(); // Automatically call handleSponsoredClick when checked
            // }
        } else if (files) {
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

    
    // let cashfree; 
    
    // let insitialzeSDK = async function () {
    //     cashfree = await load({
    //         mode: "sandbox",
    //     })
    // }
    
    // insitialzeSDK()
    
    
    // const [orderId, setOrderId] = useState("")
    
    // const getSessionId = async () => {
    //     try {
    //         let res = await axios.get("https://cashfreepayment-seven.vercel.app/payment")
    //         if (res.data && res.data.payment_session_id) {
    //             console.log(res.data)
    //             setOrderId(res.data.order_id)
    //             return res.data.payment_session_id
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    
    
    // const verifyPayment = async (doctorId) => {
    //     try {
    //         let res = await axios.post("https://cashfreepayment-seven.vercel.app/verify", {
    //             orderId: orderId
    //         });

    //         console.log(res);

    //         if (res && res.data[0].payment_status === "SUCCESS") {
    //             formData.sponsored = true;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleSponsoredClick = async (doctorId) => {
    //     try {
            
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    

    const handleSpecialistChange = (e) => {
        const value = e.target.value;
        setSelectedSpecialist(value);
        setFilteredSpecialists(specialists.filter(specialist => specialist.toLowerCase().includes(value.toLowerCase())));
        setShowDropdown(true); // Show dropdown when typing
        setSpecialistError(''); // Clear error when typing
    };

    const handleSpecialistSelect = (specialist) => {
        setSelectedSpecialist(specialist);
        setFilteredSpecialists([]);
        setShowDropdown(false); // Hide dropdown when an option is selected
        setFormData({
            ...formData,
            specialist, // Update formData with selected specialist
        });

        console.log(specialist);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate specialist
        if (!specialists.includes(selectedSpecialist)) {
            setSpecialistError('Please select a valid specialist from the list.');
            return;
        }

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
        data.append('specialist', selectedSpecialist); // Add specialist to form data
        data.append('sponsored', formData.sponsored); // Add sponsored field to form data
        
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
            // console.log("data "+ data.get('sponsored'));
            
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

                        <label htmlFor="specialist">Specialist</label>
                        <div className="specialist-dropdown">
                            <input
                                type="text"
                                id="specialist"
                                name="specialist"
                                value={selectedSpecialist}
                                placeholder="Enter speciality"
                                onChange={handleSpecialistChange}
                                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Hide dropdown on blur with delay
                                autoComplete="off"
                                required
                            />
                            {showDropdown && (
                                <ul>
                                    {filteredSpecialists.map((specialist, index) => (
                                        <li key={index} onClick={() => handleSpecialistSelect(specialist)}>
                                            {specialist}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {specialistError && <p className="error">{specialistError}</p>}

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

                        <label className="sponsored-container">
                            <input
                                type="checkbox"
                                id="sponsored"
                                name="sponsored"
                                checked={formData.sponsored}
                                onChange={handleInputChange}
                            />
                            <span className="custom-checkbox"></span>
                            <span>Sponsored</span>
                            <span className="sponsored-text">Optional</span>
                        </label>

                        {loading && <p>Registering...</p>}
                        {error && <p className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DoctorRegistration;
