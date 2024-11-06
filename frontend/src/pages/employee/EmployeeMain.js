import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './styles/EmployeeMain.css';
import { logout } from '../logout';

function EmployeeMain() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
        // If no token is found, redirect to login
        if (!token) {
          navigate('/login');
          return;
        }

        // Send the token in the authorization header
        const response = await axios.get('http://localhost:5000/api/employees/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Set the employee data based on the logged-in user
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        // Handle unauthorized access, like redirecting to login
        if (error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchEmployeeData();
  }, [navigate]);
  
  return (
    <div className="dashboard-container"> 
      <h1>ABC COMPANY</h1>
      {employee && (
        <div>
          <h2>Welcome, {employee.name}</h2>
          <p>{employee.email}</p>
        </div>
      )}
      <div>
        <button onClick={() => navigate('/employee-profile')} className="button">
          View Profile
        </button>
      </div>
      <div>
        <button onClick={() => navigate('/apply-leave')} className="button">
          Apply Leave
        </button>
      </div>
      <div>
        <button onClick={() => navigate('/leave-history')} className="button">
          View Leave History
        </button>
      </div>
      <div>
        <button onClick={logout} style={{ marginTop: '20px' }} className="button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default EmployeeMain;
