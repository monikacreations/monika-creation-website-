const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const seedData = require('./data/seed');

const app = express();

app.use(cors());
app.use(express.json());

// State flag for mock database fallback
global.useMockDb = false;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/monikas_creation';

console.log('Connecting to database...');
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds
})
.then(async () => {
  console.log('Successfully connected to MongoDB!');
  global.useMockDb = false;
  // Seed initial data if database is empty
  await seedData();

  // Ensure owner account always exists with admin rights in MongoDB
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const ownerEmail = 'sethswayam21@gmail.com';
    const ownerExists = await User.findOne({ email: ownerEmail });
    if (!ownerExists) {
      console.log('Owner account not found. Seeding owner account...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Monik@6306', salt);
      await User.create({
        name: "Monika's Creation Owner",
        email: ownerEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Owner account seeded successfully.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Monik@6306', salt);
      ownerExists.isAdmin = true;
      ownerExists.password = hashedPassword;
      await ownerExists.save();
      console.log('Owner account verified as Admin with updated password.');
    }
  } catch (err) {
    console.error('Error ensuring owner admin account:', err.message);
  }
})
.catch((err) => {
  console.warn('===============================================================');
  console.warn('WARNING: Could not connect to MongoDB database.');
  console.warn('Reason:', err.message);
  console.warn('FALLING BACK: Running with an in-memory Mock Database.');
  console.warn('All features (Auth, Cart, Checkout, Admin) remain operational.');
  console.warn('===============================================================');
  global.useMockDb = true;
});

// Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// Health check / API status route
app.get('/', (req, res) => {
  res.json({
    status: 'Online',
    brand: "Monika's Creation API",
    database: global.useMockDb ? 'Mock In-Memory' : 'MongoDB Atlas/Local',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${global.useMockDb ? 'MOCK' : 'MONGO'} database mode.`);
});
