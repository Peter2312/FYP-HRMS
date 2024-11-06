const express = require('express');
const connectDB = require('./conifg/db');
const employeeRoutes = require('./routes/employees');
const leaveRoutes = require('./routes/leaves');
const authRoutes = require('./routes/auth'); 
const cors = require('cors'); 
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/auth', authRoutes);  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
