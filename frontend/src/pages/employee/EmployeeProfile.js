import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../Profile.css';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/employees/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);

        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  return (
    <div className="dashboard-container"> 
      <h1>Welcome to Your Profile!</h1>
      {employee ? (
        <div>
          <h2>Name: <strong>{employee.name}</strong></h2>
          <h2>Email: <strong>{employee.email}</strong></h2>
          <h2>Position: <strong>{employee.position}</strong></h2>
          <h2>Monthly Salary: <strong>{employee.salary}</strong></h2>
        </div>
      ) : (
        <p>Loading profile information...</p>
      )}
      
      <div className="button-group">
        <button onClick={() => navigate('/change')} className="button">
          Change Password
        </button>

        <button className="back-to-dashboard" onClick={() => navigate('/employee-main')}>
          Back to Main Page
        </button>
      </div>
    </div>
  );
}

export default EmployeeProfile;
