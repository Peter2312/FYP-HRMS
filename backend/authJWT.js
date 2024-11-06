const jwt = require('jsonwebtoken');

// Load secret key from environment or use fallback
const jwtSecret = process.env.JWT_SECRET || 'a8208d1860844ec5c08f09457dc3583addd1cf881b994eb63cc7ee7b2476c56a281c3504be8a95bce811aa5dc9dc6cdbbce28edd2c7fbd782f71f32bf46a45cf'; 

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token not found in header' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded payload (user) to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
