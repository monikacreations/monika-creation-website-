import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { CreditCard, Truck, QrCode } from 'lucide-react';

export default function Checkout() {
  const { cartItems, getCartTotal, placeOrder, userInfo, appliedCoupon, setAppliedCoupon, validateCoupon, upiId, qrCode } = useContext(ShopContext);
  const navigate = useNavigate();

  // Redirect if cart is empty or user is not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, userInfo, navigate]);

  // Form States
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI & QR Code');
  const [utr, setUtr] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.phone && !phone) {
      setPhone(userInfo.phone);
    }
  }, [userInfo]);

  // Coupon Input States
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Price calculations
  const itemsPrice = getCartTotal();
  const shippingPrice = itemsPrice >= 2000 ? 0 : 150;
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST
  
  // Calculate discount
  const discountPrice = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - discountPrice);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    setValidatingCoupon(true);
    try {
      const data = await validateCoupon(couponCodeInput, itemsPrice);
      setAppliedCoupon(data);
      setCouponSuccess(`Coupon "${data.code}" applied! You saved ₹${data.discountAmount}`);
      setCouponCodeInput('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim() || !phone.trim()) {
      setFormError('Please fill in all shipping fields');
      return;
    }

    if (paymentMethod === 'UPI & QR Code' && (!utr.trim() || !/^[0-9]{12}$/.test(utr.trim()))) {
      setFormError('Please enter a valid 12-digit UPI Transaction Ref (UTR) Number');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
          phone
        },
        paymentMethod: paymentMethod === 'UPI & QR Code' ? `UPI & QR Code (UTR: ${utr})` : paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        discountPrice
      };

      const createdOrder = await placeOrder(orderData);
      navigate(`/order/${createdOrder._id}`);
    } catch (err) {
      setFormError(err.message || 'Error creating order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container container animate-fade">
      <div className="section-header" style={{ marginBottom: '30px', textAlign: 'left', marginLeft: '0' }}>
        <span className="section-tag">Checkout</span>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Secure Checkout</h1>
        <p className="section-desc">Provide your shipping address and complete your boutique order.</p>
      </div>

      <div className="checkout-layout">
        {/* Left Column: Forms */}
        <div className="checkout-form-panel">
          <form onSubmit={handleSubmit} className="checkout-form">
            {formError && <div className="error-banner">{formError}</div>}

            {/* Shipping Address */}
            <div className="checkout-section-card">
              <h3 className="checkout-section-title">Shipping Address</h3>
              
              <div className="auth-form-group" style={{ marginBottom: '16px' }}>
                <label className="auth-label">Full Street Address</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, block name, street number..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="auth-form-group">
                  <label className="auth-label">City</label>
                  <input
                    type="text"
                    placeholder="Kanpur, Lucknow, Delhi..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label className="auth-label">Postal / PIN Code</label>
                  <input
                    type="text"
                    placeholder="208001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '16px' }}>
                <div className="auth-form-group">
                  <label className="auth-label">Country</label>
                  <input
                    type="text"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label className="auth-label">Phone Number (for Delivery)</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section-card" style={{ marginTop: '30px' }}>
              <h3 className="checkout-section-title">Payment Method</h3>
              
              <div className="payment-method-selector">
                <div 
                  onClick={() => setPaymentMethod('UPI & QR Code')}
                  className={`payment-option-card ${paymentMethod === 'UPI & QR Code' ? 'selected' : ''}`}
                >
                  <QrCode size={28} style={{ color: paymentMethod === 'UPI & QR Code' ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span className="payment-option-title">UPI & QR Code</span>
                  <span className="payment-option-desc">Scan to pay instantly via Google Pay, PhonePe, Paytm, or BHIM.</span>
                </div>

                <div 
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`payment-option-card ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
                >
                  <Truck size={28} style={{ color: paymentMethod === 'Cash on Delivery' ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span className="payment-option-title">Cash on Delivery</span>
                  <span className="payment-option-desc">Pay in cash or UPI when your fabrics arrive at your doorstep.</span>
                </div>
              </div>

              {paymentMethod === 'UPI & QR Code' && (
                <div style={{
                  background: 'rgba(124, 45, 130, 0.03)',
                  border: '1px dashed var(--primary-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px',
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '204px', height: '204px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {qrCode ? (
                      <img 
                        src={qrCode}
                        alt="UPI QR Code" 
                        style={{ width: '180px', height: '180px', display: 'block', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ width: '180px', height: '180px' }}>
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', display: 'block' }}>
                          {/* Outer Finder Pattern Top-Left */}
                          <rect x="0" y="0" width="30" height="30" fill="var(--primary)" />
                          <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                          <rect x="10" y="10" width="10" height="10" fill="var(--primary)" />
                          
                          {/* Outer Finder Pattern Top-Right */}
                          <rect x="70" y="0" width="30" height="30" fill="var(--primary)" />
                          <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                          <rect x="80" y="10" width="10" height="10" fill="var(--primary)" />
                          
                          {/* Outer Finder Pattern Bottom-Left */}
                          <rect x="0" y="70" width="30" height="30" fill="var(--primary)" />
                          <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                          <rect x="10" y="80" width="10" height="10" fill="var(--primary)" />
                          
                          {/* Timing / Random bits */}
                          <rect x="35" y="5" width="5" height="5" fill="var(--primary)" />
                          <rect x="45" y="5" width="10" height="5" fill="var(--primary)" />
                          <rect x="60" y="5" width="5" height="5" fill="var(--primary)" />
                          
                          <rect x="35" y="15" width="15" height="5" fill="var(--primary)" />
                          <rect x="55" y="15" width="5" height="10" fill="var(--primary)" />
                          
                          <rect x="35" y="25" width="5" height="5" fill="var(--primary)" />
                          <rect x="45" y="25" width="20" height="5" fill="var(--primary)" />
                          
                          <rect x="5" y="35" width="5" height="15" fill="var(--primary)" />
                          <rect x="15" y="35" width="20" height="5" fill="var(--primary)" />
                          <rect x="40" y="35" width="10" height="10" fill="var(--primary)" />
                          <rect x="55" y="35" width="5" height="5" fill="var(--primary)" />
                          <rect x="65" y="35" width="15" height="5" fill="var(--primary)" />
                          <rect x="85" y="35" width="10" height="5" fill="var(--primary)" />

                          <rect x="5" y="55" width="15" height="5" fill="var(--primary)" />
                          <rect x="25" y="50" width="5" height="15" fill="var(--primary)" />
                          <rect x="35" y="55" width="20" height="5" fill="var(--primary)" />
                          <rect x="60" y="50" width="10" height="10" fill="var(--primary)" />
                          <rect x="75" y="55" width="5" height="5" fill="var(--primary)" />
                          <rect x="85" y="50" width="10" height="15" fill="var(--primary)" />

                          <rect x="35" y="70" width="5" height="15" fill="var(--primary)" />
                          <rect x="45" y="70" width="15" height="5" fill="var(--primary)" />
                          <rect x="65" y="70" width="5" height="20" fill="var(--primary)" />
                          <rect x="75" y="70" width="15" height="5" fill="var(--primary)" />

                          <rect x="45" y="85" width="10" height="10" fill="var(--primary)" />
                          <rect x="60" y="90" width="5" height="5" fill="var(--primary)" />
                          <rect x="75" y="85" width="20" height="5" fill="var(--primary)" />
                          <rect x="80" y="90" width="5" height="10" fill="var(--primary)" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '4px' }}>Scan & Pay with Any UPI App</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Scan the QR code above using GPay, PhonePe, Paytm, or BHIM. <br />
                      <strong>UPI ID:</strong> {upiId} <br />
                      <strong>Amount:</strong> ₹{totalPrice}
                    </p>
                  </div>
                  
                  <div className="auth-form-group" style={{ width: '100%', maxWidth: '280px', textAlign: 'left', marginTop: '6px' }}>
                    <label className="auth-label" style={{ fontSize: '0.75rem' }}>UPI Transaction ID / UTR (12-Digit)</label>
                    <input
                      type="text"
                      placeholder="e.g. 312456789012"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="form-input"
                      pattern="[0-9]{12}"
                      title="Please enter the 12-digit UPI transaction reference number"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '30px', padding: '16px 24px', fontSize: '1.05rem' }}
              disabled={submitting}
            >
              {submitting ? 'Processing Order...' : `Place Order (₹${totalPrice})`}
            </button>
          </form>
        </div>

        {/* Right Column: Summary */}
        <div className="order-summary-panel glass-panel">
          <h3 className="totals-title">Your Order</h3>
          
          <div className="summary-items-list">
            {cartItems.map((item) => (
              <div key={item.product} className="summary-item-row">
                <span className="summary-item-name-qty">
                  {item.name} <strong>x {item.qty}</strong>
                </span>
                <span className="summary-item-price">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div style={{ padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '16px 0' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '10px', fontWeight: '700' }}>🎁 Coupon Code</h4>
            
            {appliedCoupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(74, 14, 78, 0.05)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary)' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>{appliedCoupon.code}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>(-₹{appliedCoupon.discountAmount})</span>
                </div>
                <button type="button" onClick={handleRemoveCoupon} className="btn btn-outline btn-xs" style={{ fontSize: '0.7rem', padding: '2px 6px', height: 'auto', textTransform: 'none', fontWeight: '600' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.8rem', height: '36px', textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', height: '36px', fontSize: '0.8rem', textTransform: 'none' }} disabled={validatingCoupon}>
                  {validatingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </form>
            )}

            {couponError && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '6px', marginBottom: 0 }}>{couponError}</p>}
            {couponSuccess && <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '6px', marginBottom: 0 }}>{couponSuccess}</p>}
          </div>

          <div className="totals-row">
            <span>Subtotal</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '600' }}>₹{itemsPrice}</span>
          </div>

          {appliedCoupon && (
            <div className="totals-row" style={{ color: 'var(--success)' }}>
              <span>Coupon Discount ({appliedCoupon.code})</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '600' }}>-₹{discountPrice}</span>
            </div>
          )}

          <div className="totals-row">
            <span>GST (5%)</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '600' }}>₹{taxPrice}</span>
          </div>

          <div className="totals-row">
            <span>Shipping</span>
            <span style={{ color: shippingPrice === 0 ? 'var(--success)' : 'inherit', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>
              {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
            </span>
          </div>

          <div className="totals-row grand-total">
            <span>Total Amount</span>
            <span style={{ color: 'var(--primary)' }}>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
