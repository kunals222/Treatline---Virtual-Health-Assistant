import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import '../styles/DoctorLogin.css';

const DoctorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(loginUser({ email, password }));
            if (result.meta.requestStatus === 'fulfilled') {
                alert('Login Successful!');
                navigate('/');  // Redirect to home page
            } else {
                alert(`Login Failed: ${result.payload.message}`);
            }
        } catch (err) {
            alert('An error occurred during login.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Doctor Login</h2>
                {error && <p className="error-message">{error.message}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorLogin;
