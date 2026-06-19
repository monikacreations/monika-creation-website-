const bcrypt = require('bcryptjs');

// Helper to hash passwords synchronously for mock users
const salt = bcrypt.genSaltSync(10);
const hashedAdminPassword = bcrypt.hashSync('admin123', salt);
const hashedUserPassword = bcrypt.hashSync('user123', salt);
const hashedOwnerPassword = bcrypt.hashSync('Monik@6306', salt);

const mockUsers = [
  {
    _id: 'user_owner_id_003',
    name: "Monika's Creation Owner",
    email: 'sethswayam21@gmail.com',
    password: hashedOwnerPassword,
    isAdmin: true,
    createdAt: new Date()
  },
  {
    _id: 'user_customer_id_002',
    name: 'Rahul Sharma',
    email: 'customer@gmail.com',
    password: hashedUserPassword,
    isAdmin: false,
    createdAt: new Date()
  }
];

const mockProducts = [
  {
    _id: 'prod_banarasi_001',
    name: 'Royal Banarasi Silk Saree',
    description: 'A stunning royal Banarasi saree handwoven with pure zari and katan silk. Featuring classic floral jaal work, an elegant border, and a rich pallu, perfect for weddings and festive occasions.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Banarasi Fabric Works',
    fabric: 'Katan Silk',
    stock: 10,
    rating: 4.8,
    numReviews: 12,
    reviews: [
      { _id: 'rev_1', name: 'Anjali Gupta', rating: 5, comment: 'Absolutely beautiful! The fabric quality is superb.', createdAt: new Date() },
      { _id: 'rev_2', name: 'Priya Singh', rating: 4, comment: 'Gorgeous color and detailing. Highly recommend.', createdAt: new Date() }
    ],
    createdAt: new Date()
  },
  {
    _id: 'prod_banarasi_002',
    name: 'Khaddi Georgette Banarasi Saree',
    description: 'An exquisite khaddi georgette saree in deep emerald green, handwoven with silver zari motifs. Lightweight, flowy, and traditionally styled for modern elegance.',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Banarasi Fabric Works',
    fabric: 'Khaddi Georgette',
    stock: 8,
    rating: 4.6,
    numReviews: 8,
    reviews: [],
    createdAt: new Date()
  },
  {
    _id: 'prod_amritsari_001',
    name: 'Premium Phulkari Dupatta',
    description: 'Traditional Phulkari embroidery on premium cotton. Intricate geometric patterns hand-embroidered by local Punjabi artisans using vibrant silk threads. Perfect accent for any plain salwar suit.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Chanderi Cotton',
    stock: 15,
    rating: 4.9,
    numReviews: 24,
    reviews: [
      { _id: 'rev_3', name: 'Simran Kaur', rating: 5, comment: 'Authentic Phulkari work. Reminds me of Punjab. Love it!', createdAt: new Date() }
    ],
    createdAt: new Date()
  },
  {
    _id: 'prod_amritsari_002',
    name: 'Lavender Patiala Salwar Suit',
    description: 'A full suit set featuring a Lavender Kurta with delicate hand-embroidery and a heavy Patiala Salwar, paired with a matching Phulkari chiffon dupatta. Unstitched fabric for a custom fit.',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Pure Crepe',
    stock: 5,
    rating: 4.5,
    numReviews: 6,
    reviews: [],
    createdAt: new Date()
  },
  {
    _id: 'prod_purse_001',
    name: 'Bridal Velvet Potli Bag',
    description: 'A luxurious ruby red velvet potli bag decorated with pearls, beads, sequins, and gold embroidery. Features a secure drawstring closure and a pearl handle, ideal for brides and bridesmaids.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Velvet & Pearls',
    stock: 20,
    rating: 4.7,
    numReviews: 15,
    reviews: [
      { _id: 'rev_4', name: 'Ritu Verma', rating: 5, comment: 'Stunning potli! Went perfectly with my wedding lehenga.', createdAt: new Date() }
    ],
    createdAt: new Date()
  },
  {
    _id: 'prod_purse_002',
    name: 'Zardozi Silk Box Clutch',
    description: 'An elegant box clutch made of raw silk featuring intricate gold Zardozi hand-embroidery. Includes a detachable metal chain strap. Large enough to carry your phone and essentials.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Raw Silk & Zardozi',
    stock: 12,
    rating: 4.4,
    numReviews: 9,
    reviews: [],
    createdAt: new Date()
  },
  {
    _id: 'prod_purse_003',
    name: 'Brocade Floral Potli Bag',
    description: 'A stylish potli bag crafted from authentic Banarasi brocade fabric with golden floral patterns, gold tassel tie strings, and a comfortable wrist handle.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Banarasi Brocade',
    stock: 25,
    rating: 4.3,
    numReviews: 7,
    reviews: [],
    createdAt: new Date()
  },
  {
    _id: 'prod_amritsari_003',
    name: 'Mustard Phulkari Kurti',
    description: 'Mustard yellow linen kurti featuring beautiful Phulkari patchworks and neckline hand embroidery. Comfort fit for casual elegance.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Pure Linen',
    stock: 7,
    rating: 4.7,
    numReviews: 11,
    reviews: [],
    createdAt: new Date()
  }
];

const mockOrders = [];

// Helper functions to manage mock state in-memory
const getProducts = (category) => {
  if (category) {
    return mockProducts.filter(p => p.category === category);
  }
  return mockProducts;
};

const getProductById = (id) => {
  return mockProducts.find(p => p._id === id);
};

const createProduct = (data) => {
  const newProduct = {
    _id: 'prod_mock_' + Math.random().toString(36).substr(2, 9),
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    rating: 0,
    numReviews: 0,
    reviews: [],
    createdAt: new Date()
  };
  mockProducts.push(newProduct);
  return newProduct;
};

const updateProduct = (id, data) => {
  const index = mockProducts.findIndex(p => p._id === id);
  if (index !== -1) {
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      price: data.price !== undefined ? Number(data.price) : mockProducts[index].price,
      stock: data.stock !== undefined ? Number(data.stock) : mockProducts[index].stock,
    };
    return mockProducts[index];
  }
  return null;
};

const deleteProduct = (id) => {
  const index = mockProducts.findIndex(p => p._id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
};

const addReview = (productId, review) => {
  const product = getProductById(productId);
  if (product) {
    const newReview = {
      _id: 'rev_mock_' + Math.random().toString(36).substr(2, 9),
      ...review,
      createdAt: new Date()
    };
    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    return product;
  }
  return null;
};

const findUserByEmail = (email) => {
  if (!email) return null;
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  return mockUsers.find(u => u._id === id);
};

const createUser = (data) => {
  const newUser = {
    _id: 'user_mock_' + Math.random().toString(36).substr(2, 9),
    ...data,
    isAdmin: false,
    createdAt: new Date()
  };
  mockUsers.push(newUser);
  return newUser;
};

const getOrders = () => {
  return mockOrders;
};

const getMyOrders = (userId) => {
  return mockOrders.filter(o => o.user.toString() === userId.toString() || (o.user._id && o.user._id.toString() === userId.toString()));
};

const getOrderById = (id) => {
  return mockOrders.find(o => o._id === id);
};

const createOrder = (orderData, userId) => {
  const user = findUserById(userId);
  const newOrder = {
    _id: 'order_mock_' + Math.random().toString(36).substr(2, 9),
    user: {
      _id: userId,
      name: user ? user.name : 'Unknown User',
      email: user ? user.email : 'unknown@gmail.com'
    },
    ...orderData,
    isPaid: false,
    isDelivered: false,
    createdAt: new Date()
  };
  
  // Deduct stock in mock products
  for (const item of orderData.orderItems) {
    const product = getProductById(item.product);
    if (product) {
      product.stock = Math.max(0, product.stock - item.qty);
    }
  }

  mockOrders.push(newOrder);
  return newOrder;
};

const payOrder = (id) => {
  const order = getOrderById(id);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    return order;
  }
  return null;
};

const deliverOrder = (id) => {
  const order = getOrderById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
    return order;
  }
  return null;
};

const mockCoupons = [
  {
    _id: 'coupon_mock_1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 1000,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: 'coupon_mock_2',
    code: 'MONIKA500',
    discountType: 'flat',
    discountValue: 500,
    minPurchase: 5000,
    isActive: true,
    createdAt: new Date()
  }
];

const getCoupons = () => mockCoupons;

const createCoupon = (data) => {
  const newCoupon = {
    _id: 'coupon_mock_' + Math.random().toString(36).substr(2, 9),
    ...data,
    isActive: true,
    createdAt: new Date()
  };
  mockCoupons.push(newCoupon);
  return newCoupon;
};

const toggleCoupon = (id) => {
  const coupon = mockCoupons.find(c => c._id === id);
  if (coupon) {
    coupon.isActive = !coupon.isActive;
    return coupon;
  }
  return null;
};

const deleteCoupon = (id) => {
  const index = mockCoupons.findIndex(c => c._id === id);
  if (index !== -1) {
    mockCoupons.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  mockProducts,
  mockUsers,
  mockOrders,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  findUserByEmail,
  findUserById,
  createUser,
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  payOrder,
  deliverOrder,
  getCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon
};
