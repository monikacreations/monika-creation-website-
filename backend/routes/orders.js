const express = require('express');
const router = express.Router();
const dbAdapter = require('../data/dbAdapter');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      couponCode,
      discountPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const createdOrder = await dbAdapter.createOrder({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || ''
      },
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      couponCode,
      discountPrice
    });

    // Update stock for ordered products
    for (const item of orderItems) {
      const product = await dbAdapter.findProductById(item.product);
      if (product) {
        await dbAdapter.updateProduct(item.product, {
          stock: Math.max(0, product.stock - item.qty)
        });
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await dbAdapter.getOrdersByUser(req.user._id);
    // Sort descending by createdAt
    const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await dbAdapter.findOrderById(req.params.id);

    if (order) {
      const orderUserId = order.user?._id || order.user;
      // Check if user is admin or the owner of the order
      if (orderUserId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await dbAdapter.findOrderById(req.params.id);

    if (order) {
      const updatedOrder = await dbAdapter.updateOrder(req.params.id, {
        isPaid: true,
        paidAt: new Date().toISOString()
      });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await dbAdapter.findOrderById(req.params.id);

    if (order) {
      const updatedOrder = await dbAdapter.updateOrder(req.params.id, {
        isDelivered: true,
        deliveredAt: new Date().toISOString()
      });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await dbAdapter.getAllOrders();
    // Sort descending by createdAt
    const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
