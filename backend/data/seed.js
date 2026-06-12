const Product = require('../models/Product');
const User = require('../models/User');
const mockData = require('./mockData');

const seedData = async () => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Database already has product data. Skipping seed.');
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
    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedData;
