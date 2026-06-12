const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, admin } = require('../middleware/authMiddleware');
const mockData = require('../data/mockData');

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      return res.json(mockData.getCoupons());
    }
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
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

    if (global.useMockDb) {
      const exists = mockData.getCoupons().find(c => c.code === uppercaseCode);
      if (exists) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      const newCoupon = mockData.createCoupon({
        code: uppercaseCode,
        discountType,
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase || 0)
      });
      return res.status(201).json(newCoupon);
    }

    const couponExists = await Coupon.findOne({ code: uppercaseCode });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: uppercaseCode,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase || 0),
      isActive: true
    });

    const createdCoupon = await coupon.save();
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
    if (global.useMockDb) {
      const updatedCoupon = mockData.toggleCoupon(req.params.id);
      if (updatedCoupon) {
        return res.json(updatedCoupon);
      } else {
        return res.status(404).json({ message: 'Coupon not found' });
      }
    }

    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      const updatedCoupon = await coupon.save();
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
    if (global.useMockDb) {
      const success = mockData.deleteCoupon(req.params.id);
      if (success) {
        return res.json({ message: 'Coupon deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Coupon not found' });
      }
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (deletedCoupon) {
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

    let coupon;
    if (global.useMockDb) {
      coupon = mockData.getCoupons().find(c => c.code === uppercaseCode);
    } else {
      coupon = await Coupon.findOne({ code: uppercaseCode });
    }

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
