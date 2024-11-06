const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Apply for Leave
router.post('/apply', async (req, res) => {
  const { employeeId, name, leaveType, startDate, endDate } = req.body;

  try {
    // Ensure employeeId is valid
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const newLeave = new Leave({
      employeeId,
      name, 
      leaveType,
      startDate,
      endDate,
      status: 'Pending' 
    });

    const savedLeave = await newLeave.save();
    res.json(savedLeave);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// View Leave Requests by admin
router.get('/', async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate('employeeId', 'name');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Approve/Reject Leave
router.patch('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedLeave);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete leave request records by admin
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// View Leave History and Results by employee
router.get('/view/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const leaveRequests = await Leave.find({ employeeId });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).send('Server error while fetching leave history');
  }
});


module.exports = router;