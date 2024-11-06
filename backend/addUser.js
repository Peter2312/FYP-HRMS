const axios = require('axios'); 

// Register a new user
const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'KY',
      email: 'ky@gmail.com',
      password: 'ky123',
      position: 'HR',
      salary: '50000',
      role: 'admin',
    });
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || 'Unknown error');
  }
};

// Call the function to register the user
handleRegister();
