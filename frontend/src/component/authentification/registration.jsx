import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './registration.css';

export const Registration = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    // Function to validate password strength
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number.';
        }
        if (!/[@$!%*?&]/.test(password)) {
            return 'Password must contain at least one special character (@, $, !, %, *, ?, &).';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const passwordValidationMessage = validatePassword(password);
        if (passwordValidationMessage) {
            setErrorMessage(passwordValidationMessage);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/registration/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'An error occurred. Please try again.');
                return;
            }

            setSuccessMessage('Registration successful! Redirecting to Home page...');
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="background-container">
            <div className="form-container">
                <h2>Register</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input value={username} name="username" onChange={(e) => setUserName(e.target.value)} id="username" placeholder="Username" required />
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" required />
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" id="password" name="password" required />
                    <button type="submit">Register</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
            </div>
        </div>
    );
};
