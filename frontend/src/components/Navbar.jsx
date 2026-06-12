import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Search, User, Sun, Moon, Menu, X, LogOut, Settings, Bell, Info, AlertTriangle, Tag } from 'lucide-react';

export default function Navbar() {
  const { getCartCount, userInfo, logoutUser, theme, toggleTheme, backendStatus } = useContext(ShopContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      setNotifications([]);
      return;
    }

    const loadNotifications = async () => {
      try {
        const list = [];
        
        if (userInfo.isAdmin) {
          // Admin notifications
          // 1. Fetch products
          const prodRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
          if (prodRes.ok) {
            const prods = await prodRes.json();
            prods.forEach(p => {
              if (p.stock <= 3) {
                list.push({
                  id: `stock-${p._id}`,
                  type: 'warning',
                  title: 'Low Stock Warning',
                  message: `"${p.name}" has only ${p.stock} units left in stock.`,
                  time: 'Inventory Alert'
                });
              }
            });
          }
          
          // 2. Fetch orders
          const ordRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          if (ordRes.ok) {
            const ords = await ordRes.json();
            const pending = ords.filter(o => !o.isDelivered);
            pending.forEach(o => {
              list.push({
                id: `order-${o._id}`,
                type: 'info',
                title: 'Pending Dispatch',
                message: `Order #${o._id.substr(-6).toUpperCase()} by ${o.shippingAddress?.fullName || 'Guest'} needs delivery.`,
                time: new Date(o.createdAt).toLocaleDateString()
              });
            });
          }
        } else {
          // Customer notifications
          // 1. Fetch my orders
          const ordRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          if (ordRes.ok) {
            const myOrds = await ordRes.json();
            myOrds.slice(0, 5).forEach(o => {
              list.push({
                id: `myorder-${o._id}`,
                type: 'success',
                title: o.isDelivered ? 'Delivered' : 'Order Processing',
                message: `Your order #${o._id.substr(-6).toUpperCase()} is ${o.isDelivered ? 'delivered' : 'preparing for dispatch'}.`,
                time: new Date(o.createdAt).toLocaleDateString()
              });
            });
          }
          
          // 2. Fetch active coupons
          const coupRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/coupons`);
          if (coupRes.ok) {
            const coups = await coupRes.json();
            const activeCoups = coups.filter(c => c.isActive);
            activeCoups.forEach(c => {
              list.push({
                id: `coupon-${c._id}`,
                type: 'promo',
                title: '🎁 Special Offer Active',
                message: `Use code "${c.code}" to get ₹${c.discountAmount} off on orders above ₹${c.minOrderValue}!`,
                time: 'Promo'
              });
            });
          }
        }

        setNotifications(list);
      } catch (err) {
        console.warn('Navbar notifications fetch error:', err.message);
      }
    };

    loadNotifications();
    
    // Check every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [userInfo]);

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <header className="navbar-container">
      {/* Top Notification Bar */}
      <div className="top-banner">
        <p>✨ Elegant Banarasi & Amritsari Fabric Works • Free Shipping on orders above ₹2000! ✨</p>
        <span className="backend-badge" title={`Database State: ${backendStatus.type}`}>
          {backendStatus.online ? '● Connected' : '○ Offline Mode'}
        </span>
      </div>

      <nav className="main-nav container">
        {/* Left Side: Horizontal Logo (Text Left, Rotated Emblem Right) */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', padding: 0 }}>
          <div className="logo-svg-wrapper" style={{ width: '190px', height: '52px', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none' }}>
            <svg viewBox="0 0 250 70" className="peacock-logo-horizontal" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@600;800&display=swap');
                `}</style>
              </defs>
              
              {/* Left Side: Text Branding */}
              <text x="10" y="36" fontFamily="'Great Vibes', cursive" fontSize="32" fontWeight="bold">
                <tspan fill="#e6007e">M</tspan>
                <tspan fill="#18051a">onika's</tspan>
              </text>
              
              <line x1="10" y1="43" x2="140" y2="43" stroke="#18051a" strokeWidth="1.2" />
              <text x="75" y="50" textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontSize="9.5" fontWeight="800" letterSpacing="4.5" fill="#18051a">CREATION</text>
              <line x1="10" y1="52" x2="140" y2="52" stroke="#18051a" strokeWidth="1.2" />

              {/* Right Side: Rotated Emblem (90 deg Clockwise) */}
              <g transform="translate(170, 2) scale(0.66) rotate(90 50 50)">
                {/* Lotus Petals */}
                {/* Center-back (Maroon) */}
                <path d="M 50,15 C 44,28 43,45 43,58 L 57,58 C 57,45 56,28 50,15 Z" fill="#800c14" />
                {/* Inner Left (Cyan) */}
                <path d="M 37,27 C 32,35 34,48 44,58 L 49,58 C 42,48 40,38 37,27 Z" fill="#00b4d8" />
                {/* Outer Left (Magenta) */}
                <path d="M 28,39 C 23,47 29,56 42,58 L 45,58 C 34,51 29,46 28,39 Z" fill="#e6007e" />
                {/* Inner Right (Light Blue) */}
                <path d="M 63,27 C 68,35 66,48 56,58 L 51,58 C 58,48 60,38 63,27 Z" fill="#5c6bc0" />
                {/* Outer Right (Purple) */}
                <path d="M 72,39 C 77,47 71,56 58,58 L 55,58 C 66,51 71,46 72,39 Z" fill="#9c27b0" />

                {/* Peacock Silhouette Cutout */}
                <path d="M 55,58 C 55,48 53,42 53,36 C 53,32 50,30 47,32 L 41,30 L 43,35 C 41,36 42,39 45,40 C 47,41 49,40 50,37 C 50,43 45,47 45,58 Z" fill="#ffffff" />
              </g>
            </svg>
          </div>
        </Link>

        {/* Center: Search & Navigation */}
        <div className="nav-center-desktop">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search Banarasi Sarees, Suits, Purses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/shop?category=Banarasi Fabric Works" className="nav-link">Banarasi</Link>
            <Link to="/shop?category=Amritsari Fabric Works" className="nav-link">Amritsari</Link>
            <Link to="/shop?category=Ladies Purses" className="nav-link">Purses</Link>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="icon-action-btn" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="icon-action-btn cart-badge-btn" aria-label="View Cart">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && <span className="cart-badge-count">{getCartCount()}</span>}
          </Link>

          {/* Notifications Bell & Dropdown */}
          {userInfo && (
            <div className="notification-menu-wrapper">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} 
                className="icon-action-btn" 
                aria-label="View Notifications"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="notification-badge-count">{notifications.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown-menu glass-panel">
                  <div className="notification-header">
                    <h4>
                      <Bell size={16} style={{ color: 'var(--primary)' }} /> Notifications
                    </h4>
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} className="notification-clear-btn">
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="notification-items-list">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className={`notification-item ${n.type}`} style={{ cursor: userInfo.isAdmin ? 'pointer' : 'default' }} onClick={() => {
                          if (userInfo.isAdmin) {
                            navigate('/admin');
                            setShowNotifications(false);
                          }
                        }}>
                          <div className="notification-item-icon-wrapper">
                            {n.type === 'warning' && <AlertTriangle size={14} />}
                            {n.type === 'info' && <Info size={14} />}
                            {n.type === 'success' && <ShoppingBag size={14} />}
                            {n.type === 'promo' && <Tag size={14} />}
                          </div>
                          <div className="notification-item-content">
                            <span className="notification-item-title">{n.title}</span>
                            <span className="notification-item-msg">{n.message}</span>
                            <span className="notification-item-time">{n.time}</span>
                          </div>
                          <button onClick={(e) => dismissNotification(n.id, e)} className="notification-dismiss-btn" title="Dismiss">
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="notification-empty">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Icon / Profile Dropdown */}
          <div className="user-menu-wrapper">
            {userInfo ? (
              <div className="profile-trigger-container">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="icon-action-btn user-logged-btn"
                  aria-label="User Profile"
                >
                  <User size={20} />
                  <span className="user-firstname-label">{userInfo.name.split(' ')[0]}</span>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown-menu glass-panel">
                    <p className="dropdown-user-greeting">Namaste, <strong>{userInfo.name}</strong></p>
                    <hr />
                    {userInfo.isAdmin && (
                      <Link to="/admin" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>
                        <Settings size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-link logout-btn">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm login-nav-btn">
                <User size={16} /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-action-btn mobile-menu-toggler"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer glass-panel animate-fade">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="search-btn-mobile">
              <Search size={18} />
            </button>
          </form>
          
          <div className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link to="/shop?category=Banarasi Fabric Works" onClick={() => setMobileMenuOpen(false)}>Banarasi Works</Link>
            <Link to="/shop?category=Amritsari Fabric Works" onClick={() => setMobileMenuOpen(false)}>Amritsari Works</Link>
            <Link to="/shop?category=Ladies Purses" onClick={() => setMobileMenuOpen(false)}>Ladies Purses</Link>
            <hr />
            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-login-btn-link" onClick={() => setMobileMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
