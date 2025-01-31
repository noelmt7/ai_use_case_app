import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Your styles

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Track whether the user is in the registration mode

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const apiEndpoint = isRegistering ? 'http://localhost:8000/api/register/' : 'http://localhost:8000/api/login/';
        const response = await axios.post(apiEndpoint, {
            username,
            password
        });

        // On success, store the JWT token
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Call the parent callback to update login state and redirect to Industry Analysis page
            onLoginSuccess();
        } else {
            setError('Invalid login credentials');
        }
    } catch (error) {
        setError('An error occurred, please try again later.');
        console.error(error);
    }
};

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>

        {error && <p className="error-message">{error}</p>}

        {/* Toggle between login and registration */}
        <div className="toggle-register">
          <p>
            {isRegistering ? 'Already have an account? ' : "Don't have an account?"}
            <span onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
              {isRegistering ? 'Login' : 'Register'}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
