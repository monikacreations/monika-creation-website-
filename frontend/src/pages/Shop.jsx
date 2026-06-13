import React, { useContext, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  const { products, addToCart } = useContext(ShopContext);
  const location = useLocation();

  // Filter and Search States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Load URL queries on mount/location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }

    if (searchParam) {
      setSearchVal(searchParam);
    } else {
      setSearchVal('');
    }
  }, [location.search]);

  // Handle Category Checkbox Toggles
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  // Filter and Sort Processing
  const filteredProducts = products
    .filter((product) => {
      // Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      
      // Keyword/Search Filter
      if (
        searchVal.trim() &&
        !product.name.toLowerCase().includes(searchVal.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchVal.toLowerCase()) &&
        !product.fabric.toLowerCase().includes(searchVal.toLowerCase())
      ) {
        return false;
      }

      // Min Price Filter
      if (minPrice && product.price < Number(minPrice)) {
        return false;
      }

      // Max Price Filter
      if (maxPrice && product.price > Number(maxPrice)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // default: newest/id (handle both Date objects and ISO strings)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const categoriesList = ['Banarasi Fabric Works', 'Amritsari Fabric Works', 'Ladies Purses'];

  return (
    <div className="shop-page-container container animate-fade">
      <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', marginLeft: '0' }}>
        <span className="section-tag">Premium Catalog</span>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Shop Boutique Works</h1>
        <p className="section-desc">Filter through authentic collections, handcrafted fabric sets, and traditional hand embroidery.</p>
      </div>

      <div className="shop-layout">
        {/* Left Side: Sidebar Filters */}
        <aside className="shop-sidebar glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '10px' }}>
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </div>

          {/* Search bar inside sidebar */}
          <div className="filter-group">
            <h4 className="filter-group-title">Search Keyword</h4>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="form-input"
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Categories Checkboxes */}
          <div className="filter-group">
            <h4 className="filter-group-title">Categories</h4>
            <div className="filter-options">
              {categoriesList.map((cat, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-group-title">Price Range (₹)</h4>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Reset button */}
          <button 
            onClick={() => {
              setSelectedCategories([]);
              setSearchVal('');
              setMinPrice('');
              setMaxPrice('');
              setSortBy('newest');
            }} 
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Right Side: Product Grid & Sorting */}
        <main>
          <div className="shop-content-header">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Showing <strong>{filteredProducts.length}</strong> products
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shop-sort-select"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${product._id}`}>
                      <img src={product.image} alt={product.name} className="product-img" />
                    </Link>
                    <span className="product-category-badge">{product.category.split(' ')[0]}</span>
                    {product.stock === 0 && (
                      <div className="out-of-stock-overlay">
                        <span className="out-of-stock-text">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="product-details-summary">
                    <span className="product-fabric-label">{product.fabric}</span>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="product-card-title">{product.name}</h3>
                    </Link>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star-icon ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}>★</span>
                      ))}
                      <span className="rating-count-text">({product.numReviews})</span>
                    </div>
                    <div className="product-card-footer">
                      <span className="product-card-price">₹{product.price}</span>
                      <button 
                        onClick={() => addToCart(product)} 
                        disabled={product.stock === 0}
                        className={`btn-card-add ${product.stock === 0 ? 'disabled' : ''}`}
                        title={product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-shop-state">
              <h3 className="empty-shop-title">No Products Found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                We couldn't find any products matching your filters. Try checking other categories or resetting keywords.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchVal('');
                  setMinPrice('');
                  setMaxPrice('');
                }} 
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
