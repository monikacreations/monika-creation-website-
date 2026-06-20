const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const mockData = require('./mockData');
const dbAdapter = require('./dbAdapter');

const seedData = async () => {
  try {
    // Seed default coupons
    await seedCoupons();
    
    // Clean up mock products from database if present
    if (global.useMockDb === false) {
      const deleteResult = await Product.deleteMany({ _id: { $regex: /^prod_/ } });
      if (deleteResult.deletedCount > 0) {
        console.log(`Cleaned up ${deleteResult.deletedCount} mock products from database.`);
      }
    }
    
    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Seed default coupons if they don't exist
const seedCoupons = async () => {
  try {
    const defaultCoupons = [
      { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 1000, isActive: true },
      { code: 'MONIKA500', discountType: 'flat', discountValue: 500, minPurchase: 5000, isActive: true },
      { code: 'SAVE20', discountType: 'percentage', discountValue: 20, minPurchase: 3000, isActive: true }
    ];

    for (const c of defaultCoupons) {
      const exists = await dbAdapter.findCouponByCode(c.code);
      if (!exists) {
        await dbAdapter.createCoupon(c);
        console.log(`Seeded coupon: ${c.code}`);
      }
    }
  } catch (err) {
    console.error('Coupon seeding error:', err.message);
  }
};

module.exports = seedData;
