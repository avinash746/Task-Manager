const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ================================
// Protect Routes Middleware
// ================================
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token missing'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;

    // Continue
    next();
  } catch (error) {
    console.error('Auth error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    });
  }
};

// ================================
// Role Authorization Middleware
// ================================
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};
