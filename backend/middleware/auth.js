const jwt = require('jwt-simple');
const User = require('../models/User');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('company location');
    
    if (!user || user.status === 'inactive') {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth Error: ${error.message}`);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
