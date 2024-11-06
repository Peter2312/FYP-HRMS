import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import ChangePassword from './pages/employee/ChangePassword';
import ChangePasswordAdmin from './pages/admin/ChangePassword';
import AdminMain from './pages/admin/AdminMain'; 
import EmployeeMain from './pages/employee/EmployeeMain'; 
import ManageEmployees from './pages/admin/ManageEmployees'; 
import AdminProfile from './pages/admin/AdminProfile';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import ManageLeave from './pages/admin/ManageLeave';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> 
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/change" element={<ChangePassword />} />
          <Route path="/change-admin" element={<ChangePasswordAdmin />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/employee-profile" element={<EmployeeProfile />} />
          <Route path="/admin-main" element={<AdminMain />} /> 
          <Route path="/employee-main" element={<EmployeeMain />} /> 
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route path="/manage-leave" element={<ManageLeave />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
