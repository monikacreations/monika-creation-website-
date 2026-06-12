const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'flat'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    default: 0
  },
  minPurchase: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
