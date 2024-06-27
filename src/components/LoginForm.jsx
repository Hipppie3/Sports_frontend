import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login, username: contextUsername } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Log only in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending login request with:', { username, password });
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { username, password });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        alert('Logged in successfully');
        login(username); // Pass the username to the login function
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.log('Login error:', err.response?.data?.message || err.message);
      setError('YOU SHALL NOT PASS!!!');
    }
  };

  if (isAuthenticated) {
    return <div className="login-container-custom"><h2>Welcome, {contextUsername}!</h2></div>;
  }

  return (
    <div className="login-container-custom">
      <h2>Login</h2>
      <form className="login-form-custom" onSubmit={handleSubmit}>
        <div className="form-group-custom">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group-custom">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {error && <p className="error-message-custom">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
