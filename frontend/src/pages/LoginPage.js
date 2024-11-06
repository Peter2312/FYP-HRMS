import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear previous error messages
    setLoading(true);  

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Log response for debugging
      console.log('Login response:', response.data);

      // Extract the token and employee data from the response
      const { token, employeeId, role } = response.data;

      // Store the token in localStorage for future requests
      localStorage.setItem('token', token);  
      localStorage.setItem('employeeId', employeeId);  

      // Redirect based on user role
      if (role === 'admin') {
        navigate('/admin-main');  
      } else if (role === 'employee') {
        navigate('/employee-main');  
      }
    } catch (error) {
      // Handle any errors from the login attempt
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');  
    } finally {
      setLoading(false);  // Stop loading state
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">ABC COMPANY</h2>
      <div className="login-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
