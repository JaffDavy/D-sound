import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import './login.css';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Hook to navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage('Login successful!');
                
                // Assuming the response contains a token
                localStorage.setItem('token', data.token); // Store the token in localStorage
                
                // Redirect to index page (or homepage)
                navigate('/'); // '/' assumes your index page is at the root
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="background-container">
            <div className="form-container">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="youremail@gmail.com"
                        id="email"
                        name="email"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="password"
                        id="password"
                        name="password"
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('register')}>
                    Don't have an account? Register here.
                </button>
            </div>
        </div>
    );
};
