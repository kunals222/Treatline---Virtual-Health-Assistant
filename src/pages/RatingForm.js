import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDoctorRating } from '../redux/slices/authSlice';
import '../styles/RatingForm.css';

const RatingForm = ({ isOpen, onClose, doctorId }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const dispatch = useDispatch();

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateDoctorRating({ doctorId, userRating: rating, feedback }))
            .unwrap()
            .then(() => {
                alert('Thank you for your feedback!');
                setRating(0);
                setFeedback('');
                onClose();
            })
            .catch((err) => {
                alert('Failed to submit feedback. Please try again.');
                console.error(err);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="rating-form-overlay">
            <div className="rating-form-container">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Rate Your Experience</h2>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'selected' : ''}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default RatingForm;
