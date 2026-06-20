const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const mockData = require('./mockData');
const dbAdapter = require('./dbAdapter');

const seedData = async () => {
  try {
    // Seed default coupons
    await seedCoupons();
    // Seed default products
    await seedProducts();
    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

const seedProducts = async () => {
  try {
    const products = await dbAdapter.getAllProducts();
    if (products.length === 0) {
      console.log('Seeding default products to database...');
      for (const p of mockData.mockProducts) {
        // Keep standard mock product structure but ensure reviews have proper date objects
        const productToCreate = {
          ...p,
          reviews: p.reviews ? p.reviews.map(r => ({ ...r, createdAt: new Date() })) : []
        };
        await dbAdapter.createProduct(productToCreate);
      }
      console.log('Successfully seeded default products!');
    }
  } catch (err) {
    console.error('Product seeding error:', err.message);
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
