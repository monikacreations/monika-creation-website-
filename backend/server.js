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

// CORS: allow Vite dev (port 3000/3001/5173) and production origin
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl/Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// State flag for mock database fallback
global.useMockDb = false;

// Connect to Database (MongoDB or fallback to Mock Database)
const dbAdapter = require('./data/dbAdapter');

const initializeDatabase = async () => {
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/monikas_creation';
  console.log('Connecting to MongoDB database...');
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds
    });
    console.log('Successfully connected to MongoDB!');
    global.useMockDb = false;
    
    // Seed initial data if database is empty
    await seedData();

    // Ensure owner account always exists with admin rights in MongoDB
    try {
      const bcrypt = require('bcryptjs');
      const ownerEmail = 'sethswayam21@gmail.com';
      
      const ownerExists = await dbAdapter.findUserByEmail(ownerEmail);
      if (!ownerExists) {
        console.log('Owner account not found in MongoDB. Seeding owner account...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Monik@6306', salt);
        await dbAdapter.createUser({
          name: "Monika's Creation Owner",
          email: ownerEmail,
          password: hashedPassword,
          phone: '0000000000',
          isAdmin: true
        });
        console.log('Owner account seeded in MongoDB successfully.');
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Monik@6306', salt);
        await dbAdapter.updateUser(ownerExists._id, {
          isAdmin: true,
          password: hashedPassword
        });
        console.log('Owner account verified in MongoDB.');
      }
    } catch (err) {
      console.error('Error ensuring owner admin account in MongoDB:', err.message);
    }
  } catch (err) {
    console.warn('===============================================================');
    console.warn('WARNING: Could not connect to MongoDB database.');
    console.warn('Reason:', err.message);
    console.warn('FALLING BACK: Running with an in-memory Mock Database.');
    console.warn('All features (Auth, Cart, Checkout, Admin) remain operational.');
    console.warn('===============================================================');
    global.useMockDb = true;
  }
};

initializeDatabase();

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
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${global.useMockDb ? 'MOCK' : 'MONGO'} database mode.`);
});

// Handle server errors (e.g. EADDRINUSE when port is already occupied)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Stop the existing process and restart: kill the process using port ${PORT}\n`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Graceful shutdown on SIGTERM/SIGINT (used by nodemon on restart)
const shutdown = () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  // Force exit after 5 seconds if still hanging
  setTimeout(() => process.exit(0), 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
