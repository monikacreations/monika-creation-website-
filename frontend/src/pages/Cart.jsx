import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateCartQty, removeFromCart, getCartTotal, userInfo } = useContext(ShopContext);
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shippingPrice = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingPrice;

  const handleCheckoutRedirect = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px' }}>
        <div className="empty-cart-state">
          <div style={{ display: 'inline-flex', padding: '20px', background: 'rgba(74, 14, 78, 0.05)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
            <ShoppingBag size={48} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>
            Your Shopping Bag is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>
            Looks like you haven't added any Banarasi sarees, Amritsari Patiala sets, or ladies purses yet.
          </p>
          <Link to="/shop" className="btn btn-primary">Explore Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container container animate-fade">
      <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', marginLeft: '0' }}>
        <span className="section-tag">Your Bag</span>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Shopping Cart</h1>
        <p className="section-desc">Review your items before proceeding to checkout and secure delivery.</p>
      </div>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <div key={item.product} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-info-col">
                <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-price-unit">Price: ₹{item.price}</span>
              </div>

              {/* Qty edit */}
              <div className="qty-selector" style={{ transform: 'scale(0.95)' }}>
                <button onClick={() => updateCartQty(item.product, item.qty - 1)} className="qty-btn">-</button>
                <span className="qty-value">{item.qty}</span>
                <button onClick={() => updateCartQty(item.product, item.qty + 1)} className="qty-btn" disabled={item.qty >= item.stock}>+</button>
              </div>

              {/* Subtotal */}
              <div className="cart-item-subtotal">₹{item.price * item.qty}</div>

              {/* Delete button */}
              <button onClick={() => removeFromCart(item.product)} className="btn-remove-item" title="Remove from bag">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="cart-totals-panel glass-panel">
          <h3 className="totals-title">Order Summary</h3>
          
          <div className="totals-row">
            <span>Bag Subtotal</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '600' }}>₹{subtotal}</span>
          </div>
          
          <div className="totals-row">
            <span>Estimated Shipping</span>
            <span style={{ color: shippingPrice === 0 ? 'var(--success)' : 'inherit', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>
              {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
            </span>
          </div>

          {shippingPrice > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(212, 175, 55, 0.1)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              💡 Add ₹{2000 - subtotal} more to qualify for <strong>FREE Shipping</strong>!
            </p>
          )}

          <div className="totals-row grand-total" style={{ marginBottom: !userInfo ? '16px' : '20px' }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
          </div>

          {!userInfo && (
            <div style={{ 
              marginBottom: '16px', 
              padding: '12px 14px', 
              background: 'rgba(216, 27, 96, 0.05)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid rgba(216, 27, 96, 0.2)',
              fontSize: '0.8rem',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left'
            }}>
              <span>🔐</span>
              <span><strong>Authentication Required:</strong> Please register or sign in to complete your checkout and place orders.</span>
            </div>
          )}

          <button onClick={handleCheckoutRedirect} className="btn btn-primary checkout-btn-cart">
            {userInfo ? 'Secure Checkout' : 'Sign In to Checkout'} <ArrowRight size={18} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/shop" className="nav-link" style={{ fontSize: '0.85rem', fontWeight: '700' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
