import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDoctors } from '../redux/slices/authSlice';
import '../styles/FindDoctor.css';
import { load } from '@cashfreepayments/cashfree-js'
import { bookAppointment } from '../redux/slices/appointmentSlice';
import axios from 'axios';
import { GiConsoleController } from 'react-icons/gi';

const FindDoctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Track the selected doctor
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(); // Track the selected time slot
    const [showPopup, setShowPopup] = useState(false); // Control popup visibility
    const dispatch = useDispatch();
    const { doctors, loading, error , priority_score} = useSelector((state) => state.auth); // Access doctors from Redux state
    const [symptoms, setSymptoms] = useState('');
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

    useEffect(() => {
        // Fetch all doctors when the component loads
        dispatch(fetchAllDoctors());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    const handleBookAppointmentClick = (doctor) => {
        // console.log("kuna;");
        setSelectedDoctor(doctor); // Set the selected doctor
        setShowPopup(true); // Show the popup
    };

    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot); // Set the selected time slot
    };

    

    const filteredDoctors = doctors?.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let cashfree; 
    
    let insitialzeSDK = async function () {
        cashfree = await load({
            mode: "sandbox",
        })
    }
    
    insitialzeSDK()
    
    
    const [orderId, setOrderId] = useState("")
    
    const getSessionId = async () => {
        try {
            let res = await axios.get("https://cashfreepayment-seven.vercel.app/payment")
            if (res.data && res.data.payment_session_id) {
                console.log(res.data)
                setOrderId(res.data.order_id)
                return res.data.payment_session_id
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    
    const verifyPayment = async (doctorId, selectedTimeSlotIndex) => {
        try {
            let res = await axios.post("https://cashfreepayment-seven.vercel.app/verify", {
                orderId: orderId,
            });

            // console.log(res);

            if (res && res.data[0].payment_status === "SUCCESS") {
                alert("Payment verified");

                const language = 'en'; // Set the language to English
                // Pass doctorId, symptoms, selectedTimeSlotIndex, and other details to bookAppointment
                dispatch(bookAppointment({ doctorId, symptoms, selectedTimeSlot: selectedTimeSlotIndex, priority_score, language })).unwrap()
                    .then(() => {
                        alert('Appointment Query Raised successfully!');
                    })
                    .catch((err) => {
                        alert('Failed to book appointment:', err);
                    });
                setShowPopup(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = async (doctorId, selectedTimeSlotIndex) => {
        try {
            let sessionId = await getSessionId();
            let checkoutOptions = {
                paymentSessionId: sessionId,
                redirectTarget: "_modal",
            };

            cashfree.checkout(checkoutOptions).then((res) => {
                console.log("Payment initialized");
                // Pass doctorId and selectedTimeSlotIndex to verifyPayment
                verifyPayment(doctorId, selectedTimeSlotIndex);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleConfirmAppointment = () => {
        if (!selectedTimeSlot) {
            alert('Please select a time slot.');
            return;
        }
    
        const selectedTimeSlotIndex = timeSlots.indexOf(selectedTimeSlot); // Get the index of the selected time slot
        console.log(`Selected Time Slot Index: ${selectedTimeSlotIndex}`);
    
        // Call the payment function with the selected doctor's ID and time slot index
        handleClick(selectedDoctor._id, selectedTimeSlotIndex);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSymptoms(value);
    };

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

            

            {/* Popup for selecting time slots */}
            {showPopup && selectedDoctor && (
    <div className="popup-overlay">
        <div className="popup-content">
            <label htmlFor="symptoms">Symptoms</label>
            <textarea
                id="symptoms"
                name="symptoms"
                value={symptoms}
                onChange={handleChange}
                placeholder="Describe your symptoms"
                required
                className="w-full p-2 border border-gray-300 rounded"
            />
            <h3>Available Time Slots for Dr. {selectedDoctor.name}</h3>
            <ul className="time-slot-list">
                {timeSlots.map((slot, index) =>
                    selectedDoctor.time_slot[index] === 1 ? ( // Check if the time slot is available
                        <li
                            key={index}
                            className={`time-slot-item ${selectedTimeSlot === slot ? 'selected' : ''}`}
                            onClick={() => handleTimeSlotSelect(slot)}
                        >
                            {slot}
                        </li>
                    ) : null
                )}
            </ul>
            <div className="popup-actions">
                <button onClick={handleConfirmAppointment} className="confirm-button">
                    Confirm
                </button>
                <button onClick={() => setShowPopup(false)} className="cancel-button">
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

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
                                className="book-appointment-button"
                                onClick={() => handleBookAppointmentClick(doctor)}
                            >
                                Book Appointment
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