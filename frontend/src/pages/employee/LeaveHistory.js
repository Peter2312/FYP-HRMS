import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/LeaveHistory.css';

function LeaveHistory() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const navigate = useNavigate();

  // Fetch employee ID using the JWT token from localStorage
  useEffect(() => {
    const fetchEmployeeId = async () => {
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
        setEmployeeId(response.data._id);
      } catch (error) {
        console.error('Error fetching employee ID:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchEmployeeId();
  }, [navigate]);

  // Fetch leave requests based on employeeId
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (employeeId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/leaves/view/${employeeId}`);
          setLeaveRequests(response.data);
        } catch (error) {
          console.error('Error fetching leave history:', error);
        }
      }
    };

    fetchLeaveRequests();
  }, [employeeId]);

  return (
    <div className="leave-history-container">
      <h2>Your Leave History</h2>
      {leaveRequests.length > 0 ? (
        <ul>
          {leaveRequests.map((req) => (
              <li key={req._id} className="leave-item">
              <div className="leave-details">
                <strong>{req.leaveType}</strong>: {req.startDate.substring(0, 10)} to {req.endDate.substring(0, 10)}
              </div>
              <div className={`status ${req.status.toLowerCase()}`}>{req.status}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leave history found.</p>
      )}
     
      <button className="back-to-dashboard" onClick={() => navigate('/employee-main')}>
        Back to Main Page
      </button>
    </div>
  );
}

export default LeaveHistory;
