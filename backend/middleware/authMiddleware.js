const jwt = require('jsonwebtoken');
const dbAdapter = require('../data/dbAdapter');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Handle mock tokens in simulation/offline mode
      if (token.startsWith('mock-jwt-')) {
        const mockData = require('../data/mockData');
        let user;
        if (token.includes('owner') || token.includes('admin')) {
          user = mockData.findUserByEmail('sethswayam21@gmail.com');
        } else {
          user = mockData.findUserByEmail('customer@gmail.com') || mockData.mockUsers[1];
        }
        
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, mock user not found' });
        }
        req.user = user;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'monikascreationsecret');

      if (global.useMockDb) {
        const mockData = require('../data/mockData');
        req.user = mockData.findUserById(decoded.id);
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, mock user not found' });
        }
        return next();
      }

      req.user = await dbAdapter.findUserById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Exclude password from req.user
      if (req.user) {
        delete req.user.password;
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
