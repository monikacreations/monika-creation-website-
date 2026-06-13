const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const mockData = require('./mockData');

const seedData = async () => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Database already has product data. Skipping product/user seed.');
      // Still ensure default coupons exist
      await seedCoupons();
      return;
    }

    // Seed users first
    await User.deleteMany();
    
    // Create new users without custom _id to let MongoDB auto-generate them
    const seededUsers = [];
    for (const u of mockData.mockUsers) {
      const user = new User({
        name: u.name,
        email: u.email,
        password: u.password, // already hashed in mockData
        phone: u.phone || '0000000000',
        isAdmin: u.isAdmin
      });
      const savedUser = await user.save();
      seededUsers.push(savedUser);
    }
    
    console.log('Seeded Users:', seededUsers.length);

    // Seed products
    await Product.deleteMany();
    
    const seededProducts = [];
    for (const p of mockData.mockProducts) {
      const product = new Product({
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        fabric: p.fabric,
        stock: p.stock,
        rating: p.rating,
        numReviews: p.numReviews,
        reviews: p.reviews.map(r => ({
          name: r.name,
          rating: r.rating,
          comment: r.comment
        }))
      });
      const savedProduct = await product.save();
      seededProducts.push(savedProduct);
    }

    console.log('Seeded Products:', seededProducts.length);

    // Seed default coupons
    await seedCoupons();

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
      const exists = await Coupon.findOne({ code: c.code });
      if (!exists) {
        await Coupon.create(c);
        console.log(`Seeded coupon: ${c.code}`);
      }
    }
  } catch (err) {
    console.error('Coupon seeding error:', err.message);
  }
};

module.exports = seedData;
