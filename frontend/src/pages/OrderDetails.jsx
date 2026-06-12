import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Check, CreditCard, Clock, MapPin, ClipboardList, CheckCircle } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const { getOrderDetails, payOrder, deliverOrder, userInfo } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Confetti Canvas Ref
  const canvasRef = useRef(null);

  // Fetch Order Details
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(id);
      setOrder(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Trigger Confetti Effect on mount (only once)
  useEffect(() => {
    if (!loading && order) {
      runConfetti();
    }
  }, [loading]);

  // In-browser HTML5 Canvas Confetti Engine (Zero Dependency!)
  const runConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4a0e4e', '#d81b60', '#ff5c8d', '#d4af37', '#00bcd4', '#00e5ff'];
    const particles = [];

    // Create 100 confetti particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    let animationId;
    let opacity = 1;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r * 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      // Gradually fade out confetti after 4 seconds
      if (opacity > 0.01) {
        opacity -= 0.005;
        animationId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    draw();

    // Cleanup resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  };

  const handlePayOrder = async () => {
    try {
      const updated = await payOrder(order._id);
      if (updated) setOrder(updated);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    }
  };

  const handleDeliverOrder = async () => {
    try {
      const updated = await deliverOrder(order._id);
      if (updated) setOrder(updated);
    } catch (err) {
      alert(err.message || 'Delivery update failed');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Loading Order Status...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="error-banner" style={{ maxWidth: '500px', margin: '0 auto 20px' }}>{error || 'Order not found'}</div>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // Determine active stepper node based on payment/delivery status
  // 1: Ordered, 2: Packed, 3: Dispatched (Paid/COD), 4: Delivered
  let step = 1;
  if (order.isPaid || order.paymentMethod === 'Cash on Delivery') {
    step = 2; // Packed
  }
  if (order.isPaid && order.paymentMethod !== 'Cash on Delivery') {
    step = 3; // Dispatched
  }
  if (order.isDelivered) {
    step = 4; // Delivered
  }

  return (
    <div className="order-success-page container">
      {/* Full screen canvas overlay for confetti */}
      <canvas 
        ref={canvasRef} 
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 999, width: '100vw', height: '100vh' }}
      />

      {/* Success Hero Banner */}
      <div className="success-hero-card">
        <div className="checkmark-circle">
          <Check size={36} />
        </div>
        <h1 className="success-main-title">Order Placed Successfully!</h1>
        <p className="success-sub-text">
          Thank you for shopping at Monika's Creation. Your Order ID is <strong>{order._id}</strong>.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          A confirmation mail with care instructions has been sent to <strong>{order.user?.email || userInfo?.email}</strong>.
        </p>
      </div>

      {/* Shipment Tracker Stepper */}
      <div className="order-tracker-container">
        <h3 className="tracker-title">Shipment Progress</h3>
        
        <div className="tracker-stepper">
          {/* Active status indicator line */}
          <div 
            className="stepper-line-active" 
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>

          <div className={`step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
            <div className="step-icon-circle">
              <ClipboardList size={18} />
            </div>
            <span className="step-label">Ordered</span>
          </div>

          <div className={`step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
            <div className="step-icon-circle">
              <CheckCircle size={18} />
            </div>
            <span className="step-label">Packed</span>
          </div>

          <div className={`step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
            <div className="step-icon-circle">
              <Clock size={18} />
            </div>
            <span className="step-label">Dispatched</span>
          </div>

          <div className={`step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`}>
            <div className="step-icon-circle">
              <Check size={18} />
            </div>
            <span className="step-label">Delivered</span>
          </div>
        </div>

        {/* Simulation Banners (Interactive Sandbox Features) */}
        <div className="simulation-banner">
          <div className="simulation-desc-col">
            <h4 className="simulation-title">Sandbox Simulation Center</h4>
            <p className="simulation-subtitle">
              {!order.isPaid && order.paymentMethod !== 'Cash on Delivery'
                ? 'Simulate card transaction approval to advance shipping state.'
                : userInfo?.isAdmin
                ? 'Since you are logged in as Admin, you can test dispatch delivery.'
                : 'Your fabrics are being packed at Shivala Road boutique!'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {!order.isPaid && order.paymentMethod !== 'Cash on Delivery' && (
              <button onClick={handlePayOrder} className="btn btn-accent btn-sm">
                <CreditCard size={14} /> Clear Payment (₹{order.totalPrice})
              </button>
            )}

            {userInfo?.isAdmin && !order.isDelivered && (
              <button onClick={handleDeliverOrder} className="btn btn-primary btn-sm">
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="order-info-details-grid">
        {/* Left Column: Order Items */}
        <div className="details-block">
          <h3 className="details-block-title">Ordered Items</h3>
          
          <div className="order-items-list-box">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="order-item-row-display">
                <img src={item.image} alt={item.name} className="order-item-thumb" />
                <div>
                  <div className="order-item-desc"><strong>{item.name}</strong></div>
                  <div className="order-item-price-qty">Price: ₹{item.price} • Quantity: {item.qty}</div>
                </div>
                <span className="order-item-total">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Address and Payments info */}
        <div className="details-block">
          <h3 className="details-block-title">Delivery Details</h3>
          <div className="address-summary-block" style={{ marginBottom: '24px' }}>
            <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <MapPin size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
              <strong>Shipping Address:</strong>
            </p>
            <p style={{ paddingLeft: '24px', color: 'var(--text-muted)' }}>
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city} - {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <h3 className="details-block-title">Payment Info</h3>
          <div>
            <p style={{ fontSize: '0.95rem' }}>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            <p style={{ fontSize: '0.95rem', marginTop: '6px' }}>
              <strong>Status:</strong>{' '}
              <span style={{ fontWeight: '700', color: order.isPaid ? 'var(--success)' : 'var(--warning)' }}>
                {order.isPaid ? `Paid (on ${new Date(order.paidAt).toLocaleDateString()})` : 'Pending Payment'}
              </span>
            </p>
            {order.isDelivered && (
              <p style={{ fontSize: '0.95rem', marginTop: '6px' }}>
                <strong>Delivered:</strong>{' '}
                <span style={{ fontWeight: '700', color: 'var(--success)' }}>
                  Yes (on {new Date(order.deliveredAt).toLocaleDateString()})
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
