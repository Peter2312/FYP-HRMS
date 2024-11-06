import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './styles/ManageEmployees.css'; 

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on the search term
    setFilteredEmployees(
      employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.dateJoined.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Set initial filtered employees
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Handle employee form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmAdd = window.confirm("Are you sure you want to add this employee?");
    if (!confirmAdd) {
      return; 
    }

    try {
      if (editId) {
        // Update existing employee
        await axios.put(`http://localhost:5000/api/employees/update/${editId}`, {
          name,
          email,
          position,
          salary,
        });
      } else {
        // Create new employee
        await axios.post('http://localhost:5000/api/employees/add', {
          name,
          email,
          password: 'abc123', 
          position,
          salary,
          role: 'employee',
        });
        setNotification({ message: 'Registration successful!', type: 'success' });
      }

      // Clear form and refresh employee list
      clearForm();

      fetchEmployees();

    } catch (error) {
      console.error('Error submitting employee:', error.response?.data?.message || error.message);
    }
  };

  // Clear form fields
  const clearForm = () => {
    setName('');
    setEmail('');
    setPosition('');
    setSalary('');
    setEditId(null);
  };

  // Handle editing employee
  const handleEdit = (employee) => {
    const confirmUpdate = window.confirm("Are you sure you want to edit the details of this employee?");
    if (!confirmUpdate) {
      return; 
    }
    setName(employee.name);
    setEmail(employee.email);
    setPosition(employee.position);
    setSalary(employee.salary);
    setEditId(employee._id);
  };

  // Handle deleting employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) {
      return; 
    }
    try {
      await axios.delete(`http://localhost:5000/api/employees/delete/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

   // Automatically clear notification after 5 seconds
   useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div className="manage-employees">
      <h2>MANAGE EMPLOYEE RECORDS</h2>

      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '50%' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '50%' }}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          style={{ width: '50%' }}
        />
        <input
          type="number"
          placeholder="Monthly Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          style={{ width: '50%' }}
        />
        <div className="button-container">
          <button type="submit">{editId ? 'Update Employee' : 'Add New Employee'}</button>
          <button type="button" onClick={clearForm}>Clear Form</button>
        </div>
      </form>
    
      <h3>ABC COMPANY EMPLOYEE LIST</h3>
      <input
        type="text"
        placeholder="Search by name / position"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '50%' }}
      />
      <ul>
        {filteredEmployees.map(employee => (
          <li className="employee-list" key={employee._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span> {employee.name} </span>
            <div>Email: <strong>{employee.email}</strong></div>
            <div>Position: <strong>{employee.position}</strong></div>
            <div>Monthly Salary: <strong>{employee.salary}</strong></div>
            <div>Date Joined: <strong>{formatDate(employee.dateJoined)}</strong></div>
            <div className="button-column">
              <button className="edit-button" onClick={() => handleEdit(employee)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(employee._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      
      <button className="back-to-dashboard" onClick={() => navigate('/admin-main')}>
        Back to Main Page
      </button>
    </div>
  );
};

export default ManageEmployees;
