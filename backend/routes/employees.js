const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authMiddleware = require('../authMiddleware');

// Create New Employee
router.post('/add', async (req, res) => {
  const { name, email, password, position, salary, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = new Employee({
      name,
      email,
      password,
      position,
      salary,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); 
    res.status(500).json({ message: 'Server error' });
  }
});

// Read (Get All Employees)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update Employee
router.put('/update/:id', async (req, res) => {
  const { name, email, position, salary } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, position, salary },
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete Employee
router.delete('/delete/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Employee deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get logged-in employee's details
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;