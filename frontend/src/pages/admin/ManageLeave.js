import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './styles/ManageLeave.css';

const ManageLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Fetch leave requests from the backend
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves');
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  // Approve leave requests
  const handleLeaveApprove = async (id, status) => {
    const confirmDelete = window.confirm("Are you sure you want to approve this leave request?");
    if (!confirmDelete) {
      return; 
    }
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}`, { status });
      fetchLeaveRequests(); // Refresh the list after approval/rejection
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  // Reject leave requests
  const handleLeaveReject = async (id, status) => {
    const confirmDelete = window.confirm("Are you sure you want to reject this leave request?");
    if (!confirmDelete) {
      return; 
    }
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}`, { status });
      fetchLeaveRequests(); // Refresh the list after approval/rejection
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  // Delete leave requests
  const handleDeleteLeave = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave request record?");
    if (!confirmDelete) {
      return; 
    }
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      fetchLeaveRequests(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting leave request:', error);
    }
  };

  return (
    <div className="manage-leave">
      <h2>LEAVE REQUESTS</h2>
      {leaveRequests.length === 0 ? (
        <p>No leave requests so far</p>
      ) : (
        <ul>
          {leaveRequests.map(req => {
            const startDate = new Date(req.startDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
           
            const endDate = new Date(req.endDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <li key={req._id} className={`leave-request ${req.status.toLowerCase()}`}>
                <div>
                  <strong>{req.name}</strong> requested <strong>{req.leaveType}</strong> from <strong>{startDate}</strong> to <strong>{endDate}</strong>.
                </div>
                <div className="status-container">
                  <span>Status: </span>
                  <span className={`status ${req.status.toLowerCase()}`}>{req.status}</span>
                </div>
                {req.status === 'Pending' && (
                  <div className="action-buttons">
                    <button className="approve" onClick={() => handleLeaveApprove(req._id, 'Approved')}>Approve</button>
                    <button className="reject" onClick={() => handleLeaveReject(req._id, 'Rejected')}>Reject</button>
                  </div>
                )}
                {(req.status === 'Approved' || req.status === 'Rejected') && (
                  <div>
                  <button className="delete" onClick={() => handleDeleteLeave(req._id)}>Delete</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <button className="back-to-dashboard" onClick={() => navigate('/admin-main')}>
        Back to Main Page
      </button>
    </div>
  );
};

export default ManageLeave;
