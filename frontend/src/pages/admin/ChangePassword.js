import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../employee/styles/ChangePassword.css";

const ChangePasswordAdmin = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to change your password.');
        return navigate('/login');
      }

      // Send PUT request with authorization header
      const response = await axios.put('http://localhost:5000/api/auth/change',{ currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Display success message
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(error.response?.data?.message || 'Error changing password');
      
      // Handle unauthorized error
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <span className='change-password' >CHANGE PASSWORD ADMIN</span>
      <form className="change-form" onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}

      <button className="back-to-dashboard" onClick={() => navigate('/admin-main')}>
        Back to Main Page
      </button>
    </div>
  );
};

export default ChangePasswordAdmin;
