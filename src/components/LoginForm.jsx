// src/components/LoginForm.jsx

import React, { useState } from 'react';
import './LoginForm.css'

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
    } else {
      // Handle registration logic here
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
  };

  return (
    <div className="login-container-custom">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
        {!isLogin && (
          <div className="form-group-custom">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" className="login-button">{isLogin ? 'Login' : 'Register'}</button>
        <p className="error-message-custom">{error}</p>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={handleToggle}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
