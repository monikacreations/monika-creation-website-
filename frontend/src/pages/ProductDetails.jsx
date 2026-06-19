import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, ShoppingCart, Info, Star } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, userInfo, addProductReview } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setQty(1); // Reset qty on product change
      setActiveImage(foundProduct.image);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Loading Product Details...</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const handleQtyChange = (val) => {
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQty(newQty);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!comment.trim()) {
      setReviewError('Please enter a review comment');
      return;
    }

    try {
      const result = await addProductReview(product._id, { rating, comment });
      if (result.success) {
        setReviewSuccess(true);
        setComment('');
        setRating(5);
      }
    } catch (err) {
      setReviewError(err.message || 'Error submitting review');
    }
  };

  return (
    <div className="product-details-container container animate-fade">
      <Link to="/shop" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: '700' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="details-grid">
        {/* Left Side: Product Image Gallery */}
        <div className="details-image-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="main-image-container" style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={activeImage || product.image} 
              alt={product.name} 
              className="details-img" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnails-row" style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'thin'
            }}>
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  type="button"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: activeImage === imgUrl ? '2px solid var(--primary-dark)' : '1px solid var(--border-color)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    flexShrink: 0,
                    boxShadow: activeImage === imgUrl ? '0 0 8px rgba(74, 14, 78, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="details-content-panel">
          <span className="details-category">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          <div className="details-rating-row">
            <div className="rating-stars" style={{ marginBottom: 0 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star-icon ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <strong>{product.rating}</strong>/5 ({product.numReviews} customer reviews)
            </span>
          </div>

          <div className="details-price">₹{product.price}</div>

          <p className="details-desc">{product.description}</p>

          {/* Specifications */}
          <div className="spec-list">
            <div className="spec-item">
              <span className="spec-label">Fabric / Material</span>
              <span className="spec-value">{product.fabric}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Availability</span>
              <span className={`spec-value ${product.stock > 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: '700', color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          {product.stock > 0 && (
            <div className="details-action-row">
              <div className="qty-selector">
                <button onClick={() => handleQtyChange(-1)} className="qty-btn" disabled={qty <= 1}>-</button>
                <span className="qty-value">{qty}</span>
                <button onClick={() => handleQtyChange(1)} className="qty-btn" disabled={qty >= product.stock}>+</button>
              </div>
              <button onClick={() => addToCart(product, qty)} className="btn btn-primary details-btn-add">
                <ShoppingCart size={18} /> Add to Shopping Bag
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '30px' }}>
          Customer Reviews ({product.reviews.length})
        </h2>

        <div className="reviews-grid">
          {/* Reviews List */}
          <div className="reviews-list-panel">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev._id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{rev.name}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star-icon ${i < rev.rating ? 'star-filled' : 'star-empty'}`} style={{ fontSize: '0.85rem' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', background: 'var(--bg-color)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to share your experience with this boutique creation!
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="review-form-panel">
            <h3 className="review-form-title">Write a Review</h3>
            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                {reviewSuccess && (
                  <div style={{ background: 'rgba(46, 125, 50, 0.08)', border: '1px solid var(--success)', color: 'var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    Thank you! Your review has been added.
                  </div>
                )}
                {reviewError && <div className="error-banner">{reviewError}</div>}

                <div className="auth-form-group">
                  <label className="auth-label">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))} 
                    className="review-select-rating"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Your Comment</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input"
                    placeholder="Describe the fabric weave, fit, color accuracy, or purse finish..."
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }}>
                  Submit Review
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.95rem' }}>
                  You must be logged in to leave a review.
                </p>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
