const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const mockData = require('./mockData');

// Check database mode
const getDbMode = () => {
  if (global.useMockDb) return 'mock';
  return 'mongo';
};

// --- USER OPERATIONS ---
const findUserByEmail = async (email) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.findUserByEmail(email);
  }
  // mongo
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.createUser(userData);
  }
  // mongo
  return await User.create(userData);
};

const findUserById = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.findUserById(id);
  }
  // mongo
  return await User.findById(id);
};

const getAllUsers = async () => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockUsers;
  }
  // mongo
  return await User.find({}).select('-password');
};

// --- PRODUCT OPERATIONS ---
const getAllProducts = async () => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockProducts;
  }
  // mongo
  return await Product.find({});
};

const findProductById = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockProducts.find(p => p._id === id);
  }
  // mongo
  return await Product.findById(id);
};

const createProduct = async (productData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    const newId = 'prod_mock_' + Math.random().toString(36).substr(2, 9);
    const prod = {
      _id: newId,
      ...productData,
      rating: 4.5,
      numReviews: 0,
      reviews: [],
      createdAt: new Date().toISOString()
    };
    mockData.mockProducts.unshift(prod);
    return prod;
  }
  // mongo
  return await Product.create(productData);
};

const updateProduct = async (id, productData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    let index = mockData.mockProducts.findIndex(p => p._id === id);
    if (index !== -1) {
      mockData.mockProducts[index] = { ...mockData.mockProducts[index], ...productData };
      return mockData.mockProducts[index];
    }
    return null;
  }
  // mongo
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    mockData.mockProducts = mockData.mockProducts.filter(p => p._id !== id);
    return true;
  }
  // mongo
  const res = await Product.findByIdAndDelete(id);
  return !!res;
};

const addProductReview = async (productId, reviewData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    let product = mockData.mockProducts.find(p => p._id === productId);
    if (product) {
      const review = {
        _id: 'rev_mock_' + Math.random().toString(36).substr(2, 9),
        ...reviewData,
        createdAt: new Date().toISOString()
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      return product;
    }
    return null;
  }
  // mongo
  const product = await Product.findById(productId);
  if (product) {
    product.reviews.push(reviewData);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    return product;
  }
  return null;
};

// --- ORDER OPERATIONS ---
const createOrder = async (orderData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    const newOrder = {
      _id: 'order_mock_' + Math.random().toString(36).substr(2, 9),
      ...orderData,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString()
    };
    mockData.mockOrders.unshift(newOrder);
    return newOrder;
  }
  // mongo
  return await Order.create(orderData);
};

const getOrdersByUser = async (userId) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockOrders.filter(o => o.user._id === userId || o.user === userId);
  }
  // mongo
  return await Order.find({ user: userId });
};

const findOrderById = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockOrders.find(o => o._id === id);
  }
  // mongo
  return await Order.findById(id).populate('user', 'name email');
};

const getAllOrders = async () => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockOrders;
  }
  // mongo
  return await Order.find({}).populate('user', 'name email');
};

const updateOrder = async (id, orderData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    let index = mockData.mockOrders.findIndex(o => o._id === id);
    if (index !== -1) {
      mockData.mockOrders[index] = { ...mockData.mockOrders[index], ...orderData };
      return mockData.mockOrders[index];
    }
    return null;
  }
  // mongo
  return await Order.findByIdAndUpdate(id, orderData, { new: true });
};

// --- COUPON OPERATIONS ---
const getAllCoupons = async () => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockCoupons;
  }
  // mongo
  return await Coupon.find({});
};

const findCouponByCode = async (code) => {
  const mode = getDbMode();
  const codeUpper = code.trim().toUpperCase();
  if (mode === 'mock') {
    return mockData.mockCoupons.find(c => c.code === codeUpper);
  }
  // mongo
  return await Coupon.findOne({ code: codeUpper });
};

const createCoupon = async (couponData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    const newCoupon = {
      _id: 'coupon_mock_' + Math.random().toString(36).substr(2, 9),
      ...couponData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    mockData.mockCoupons.unshift(newCoupon);
    return newCoupon;
  }
  // mongo
  return await Coupon.create(couponData);
};

const findCouponById = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    return mockData.mockCoupons.find(c => c._id === id);
  }
  // mongo
  return await Coupon.findById(id);
};

const updateCoupon = async (id, couponData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    let index = mockData.mockCoupons.findIndex(c => c._id === id);
    if (index !== -1) {
      mockData.mockCoupons[index] = { ...mockData.mockCoupons[index], ...couponData };
      return mockData.mockCoupons[index];
    }
    return null;
  }
  // mongo
  return await Coupon.findByIdAndUpdate(id, couponData, { new: true });
};

const deleteCoupon = async (id) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    mockData.mockCoupons = mockData.mockCoupons.filter(c => c._id !== id);
    return true;
  }
  // mongo
  const res = await Coupon.findByIdAndDelete(id);
  return !!res;
};

const updateUser = async (id, userData) => {
  const mode = getDbMode();
  if (mode === 'mock') {
    let index = mockData.mockUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      mockData.mockUsers[index] = { ...mockData.mockUsers[index], ...userData };
      return mockData.mockUsers[index];
    }
    return null;
  }
  // mongo
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  getAllUsers,
  updateUser,
  getAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  createOrder,
  getOrdersByUser,
  findOrderById,
  getAllOrders,
  updateOrder,
  getAllCoupons,
  findCouponByCode,
  createCoupon,
  findCouponById,
  updateCoupon,
  deleteCoupon
};
