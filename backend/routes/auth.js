const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbAdapter = require('../data/dbAdapter');
const { protect, admin } = require('../middleware/authMiddleware');
const mockData = require('../data/mockData');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'monikascreationsecret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbAdapter.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const userExists = await dbAdapter.findUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbAdapter.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await dbAdapter.findUserById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await dbAdapter.getAllUsers();
    // Exclude password from output
    const usersWithoutPassword = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In-memory OTP store: { phone: { otp, expiresAt } }
const otpStore = {};

// @desc    Send OTP for phone verification
// @route   POST /api/users/send-otp
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit phone number.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes
    otpStore[phone] = { otp, expiresAt };

    // In production: send via SMS provider (Twilio, MSG91, etc.)
    // Demo mode: return OTP in response
    console.log(`[OTP DEMO] Phone: ${phone}  OTP: ${otp}`);
    res.json({ 
      success: true, 
      message: 'OTP sent successfully.',
      demoOtp: otp  // Remove this line in production with real SMS
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP for phone
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = otpStore[phone];

    if (!record) {
      return res.status(400).json({ message: 'No OTP found for this number. Please request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // OTP is correct — mark as verified, clean up
    delete otpStore[phone];
    res.json({ success: true, message: 'Phone number verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
