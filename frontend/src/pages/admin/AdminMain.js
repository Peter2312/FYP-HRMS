import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/AdminMain.css';
import { logout } from '../logout'; 

function AdminMain() {
  const navigate = useNavigate(); 

  return (
    <div className="admin-dashboard">
      <h1>ABC COMPANY Admin</h1>

      <div className="button-section">
        <button className="toggle-btn" onClick={() => navigate('/admin-profile')}>
          View Profile
        </button>
        <button className="toggle-btn" onClick={() => navigate('/manage-employees')}>
          Manage and View Employee Records
        </button>
        <button className="toggle-btn" onClick={() => navigate('/manage-leave')}>
          Manage Leave Requests
        </button>
      </div>

      {/* Logout Button */}
      <button onClick={logout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}

export default AdminMain;
