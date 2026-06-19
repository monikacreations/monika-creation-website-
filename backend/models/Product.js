const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true,
    enum: ['Banarasi Fabric Works', 'Amritsari Fabric Works', 'Ladies Purses']
  },
  fabric: {
    type: String,
    default: 'N/A'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
