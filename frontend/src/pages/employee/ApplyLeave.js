import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './styles/ApplyLeave.css';

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employee, setEmployee] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch employee details using the JWT token from localStorage
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
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
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchEmployeeDetails();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm("Are you sure to submit this leave request?");
    if (!confirmDelete) {
      return; 
    }

    const leaveData = {
      employeeId: employee._id,
      name: employee.name,
      leaveType,
      startDate,
      endDate,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/leaves/apply', leaveData);
      setMessage('LEAVE REQUEST SUBMITTED SUCCESSFULLY!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error requesting leave. Please try again.');
      console.error('Error requesting leave:', error);
    }
  };

  return (
    <div className="apply-leave-container">
      <h2>Apply Leave</h2>
      {employee.name && <p>Employee Name: <strong>{employee.name}</strong></p>}
      {employee.leaveBalance === 0 ? (
        <p className="no-leave-message">You have no remaining leave balance. Leave request cannot be submitted.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
            <option value="">Select Leave Type</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Vacation Leave">Vacation Leave</option>
            <option value="Casual Leave">Casual Leave</option>
          </select>
          <p>Start Date</p>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <p>End Date</p>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <button className="submit-button" type="submit">Submit Leave Request</button>
        </form>
      )}
      {message && <p>{message}</p>}

      <button className="back-to-dashboard" onClick={() => navigate('/employee-main')}>
        Back to Main Page
      </button>
    </div>
  );
}

export default ApplyLeave;
