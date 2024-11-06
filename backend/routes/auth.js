const express = require('express');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const authMiddleware = require('../authMiddleware');

// Use environment variable or a secret key for JWT
const jwtSecret = process.env.JWT_SECRET || 'a8208d1860844ec5c08f09457dc3583addd1cf881b994eb63cc7ee7b2476c56a281c3504be8a95bce811aa5dc9dc6cdbbce28edd2c7fbd782f71f32bf46a45cf'; 

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email }); 

    // Check if the user exists
    const user = await Employee.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password); 

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token after successful login
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    console.log('Login successful for user:', email);
    res.json({
      message: 'Login successful',
      role: user.role,
      token, // Send token to the client
    });
  } catch (error) {
    console.error('Error during login:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
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
    console.error('Error during registration:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password route
router.put('/change', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const employee = await Employee.findById(req.user.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const isMatch = await employee.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Set new password 
    employee.password = newPassword;
    await employee.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;