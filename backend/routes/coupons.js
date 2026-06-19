const express = require('express');
const router = express.Router();
const dbAdapter = require('../data/dbAdapter');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const coupons = await dbAdapter.getAllCoupons();
    // Sort descending by createdAt
    const sorted = coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minPurchase } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ message: 'Please provide code, type and value' });
    }

    const uppercaseCode = code.trim().toUpperCase();

    const couponExists = await dbAdapter.findCouponByCode(uppercaseCode);
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const createdCoupon = await dbAdapter.createCoupon({
      code: uppercaseCode,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase || 0)
    });
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle coupon active status (Admin only)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await dbAdapter.findCouponById(req.params.id);
    if (coupon) {
      const updatedCoupon = await dbAdapter.updateCoupon(req.params.id, {
        isActive: !coupon.isActive
      });
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const success = await dbAdapter.deleteCoupon(req.params.id);
    if (success) {
      res.json({ message: 'Coupon deleted successfully' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Validate a coupon code (Public/Customer)
// @route   POST /api/coupons/validate
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) {
      return res.status(400).json({ message: 'Coupon code and subtotal are required' });
    }

    const uppercaseCode = code.trim().toUpperCase();

    const coupon = await dbAdapter.findCouponByCode(uppercaseCode);

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    if (Number(subtotal) < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase} is required to use this coupon` });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((Number(subtotal) * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Discount cannot exceed subtotal
    discountAmount = Math.min(discountAmount, Number(subtotal));

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
