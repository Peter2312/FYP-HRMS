const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },

  name: { 
    type: String,
    ref: 'Employee',
    required: true,
  },

  leaveType: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  
  applicationDate: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to validate the date range
LeaveSchema.pre('validate', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('Start date must be before end date.'));
  }
  next();
});

module.exports = mongoose.model('Leave', LeaveSchema);