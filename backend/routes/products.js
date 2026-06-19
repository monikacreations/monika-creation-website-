const express = require('express');
const router = express.Router();
const dbAdapter = require('../data/dbAdapter');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  try {
    const category = req.query.category;
    let products = await dbAdapter.getAllProducts();
    if (category) {
      products = products.filter(p => p.category === category);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  try {
    const product = await dbAdapter.findProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, images, category, fabric, stock } = req.body;

    const createdProduct = await dbAdapter.createProduct({
      name: name || 'Sample Name',
      price: price || 0,
      image: image || '/images/sample.jpg',
      images: images || [],
      category: category || 'Banarasi Fabric Works',
      fabric: fabric || 'Cotton',
      stock: stock || 0,
      description: description || 'Sample description',
    });
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, images, category, fabric, stock } = req.body;

    const product = await dbAdapter.findProductById(req.params.id);

    if (product) {
      const updatedProduct = await dbAdapter.updateProduct(req.params.id, {
        name: name ?? product.name,
        price: price ?? product.price,
        description: description ?? product.description,
        image: image ?? product.image,
        images: images ?? product.images,
        category: category ?? product.category,
        fabric: fabric ?? product.fabric,
        stock: stock ?? product.stock,
      });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const success = await dbAdapter.deleteProduct(req.params.id);
    if (success) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await dbAdapter.findProductById(req.params.id);

    if (product) {
      const reviews = product.reviews || [];
      const alreadyReviewed = reviews.find(
        (r) => r.user?.toString() === req.user._id.toString() || r.name === req.user.name
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      await dbAdapter.addProductReview(req.params.id, {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      });
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
