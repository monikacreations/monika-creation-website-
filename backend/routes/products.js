const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const mockData = require('../data/mockData');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    if (global.useMockDb) {
      return res.json(mockData.getProducts(category));
    }
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (global.useMockDb) {
      const product = mockData.getProductById(req.params.id);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const product = await Product.findById(req.params.id);
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
    const { name, price, description, image, category, fabric, stock } = req.body;

    if (global.useMockDb) {
      const createdProduct = mockData.createProduct({
        name,
        price,
        description,
        image,
        category,
        fabric,
        stock
      });
      return res.status(201).json(createdProduct);
    }

    const product = new Product({
      name: name || 'Sample Name',
      price: price || 0,
      user: req.user._id,
      image: image || '/images/sample.jpg',
      category: category || 'Banarasi Fabric Works',
      fabric: fabric || 'Cotton',
      stock: stock || 0,
      description: description || 'Sample description',
    });

    const createdProduct = await product.save();
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
    const { name, price, description, image, category, fabric, stock } = req.body;

    if (global.useMockDb) {
      const updatedProduct = mockData.updateProduct(req.params.id, {
        name, price, description, image, category, fabric, stock
      });
      if (updatedProduct) {
        return res.json(updatedProduct);
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.category = category ?? product.category;
      product.fabric = fabric ?? product.fabric;
      product.stock = stock ?? product.stock;

      const updatedProduct = await product.save();
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
    if (global.useMockDb) {
      const success = mockData.deleteProduct(req.params.id);
      if (success) {
        return res.json({ message: 'Product removed' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct) {
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

    if (global.useMockDb) {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      const updatedProduct = mockData.addReview(req.params.id, review);
      if (updatedProduct) {
        return res.status(201).json({ message: 'Review added' });
      } else {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user?.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
