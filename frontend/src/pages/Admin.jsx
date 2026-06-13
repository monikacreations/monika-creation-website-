import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { 
  PlusCircle, Edit3, Trash2, ShoppingBag, IndianRupee, Layers, 
  AlertCircle, CheckCircle, BarChart3, Users, Search, FileSpreadsheet 
} from 'lucide-react';

export default function Admin() {
  const { 
    products, userInfo, backendStatus, addProduct, editProduct, deleteProduct, getAllOrders, deliverOrder, payOrder,
    getCoupons, createCoupon, toggleCoupon, deleteCoupon,
    upiId, qrCode, updateUpiSettings
  } = useContext(ShopContext);
  const navigate = useNavigate();

  // Tab State: 'catalog', 'orders', 'analytics', 'customers', 'coupons'
  const [activeTab, setActiveTab] = useState('catalog');
  const [customerSearch, setCustomerSearch] = useState('');

  // Form State
  const [editingId, setEditingId] = useState(null); // null means "Add Product" mode
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Banarasi Fabric Works');
  const [fabric, setFabric] = useState('Cotton');
  const [stock, setStock] = useState('10');
  const [imageSourceType, setImageSourceType] = useState('file'); // 'file' or 'url'
  
  // Settings Form States
  const [settingsUpi, setSettingsUpi] = useState(upiId);
  const [settingsQr, setSettingsQr] = useState(qrCode);
  const [qrSourceType, setQrSourceType] = useState(qrCode ? 'file' : 'none');

  useEffect(() => {
    setSettingsUpi(upiId);
    setSettingsQr(qrCode);
    setQrSourceType(qrCode ? 'file' : 'none');
  }, [upiId, qrCode]);
  
  // Orders list state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState('percentage');
  const [couponDiscountValue, setCouponDiscountValue] = useState('');
  const [couponMinPurchase, setCouponMinPurchase] = useState('');
  const [submittingCoupon, setSubmittingCoupon] = useState(false);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Could not load orders for admin', err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setCouponsLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error('Could not load coupons for admin', err.message);
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.isAdmin) {
      fetchOrders();
      fetchCoupons();
    }
  }, [userInfo]);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponDiscountValue) {
      alert('Please fill in coupon code and value');
      return;
    }

    setSubmittingCoupon(true);
    try {
      await createCoupon({
        code: couponCode.trim().toUpperCase(),
        discountType: couponDiscountType,
        discountValue: Number(couponDiscountValue),
        minPurchase: Number(couponMinPurchase || 0)
      });
      alert('Coupon code launched successfully!');
      setCouponCode('');
      setCouponDiscountValue('');
      setCouponMinPurchase('');
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Error creating coupon');
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await toggleCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Error toggling coupon status');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        alert('Coupon deleted successfully');
        fetchCoupons();
      } catch (err) {
        alert(err.message || 'Error deleting coupon');
      }
    }
  };

  if (!userInfo || !userInfo.isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error)', marginBottom: '20px' }}>Access Denied</h2>
        <p>You do not have administrative clearance to access this dashboard.</p>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Create or Update submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !image.trim() || !description.trim()) {
      alert('Please fill in all product fields');
      return;
    }

    const productPayload = {
      name,
      price: Number(price),
      description,
      image,
      category,
      fabric,
      stock: Number(stock)
    };

    try {
      if (editingId) {
        await editProduct(editingId, productPayload);
        alert('Product updated successfully!');
      } else {
        await addProduct(productPayload);
        alert('Product created successfully!');
      }
      resetForm();
      fetchOrders(); // Refresh numbers
    } catch (err) {
      alert(err.message || 'Error processing product');
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
    setImage(p.image);
    setCategory(p.category);
    setFabric(p.fabric);
    setStock(p.stock);
    if (p.image && p.image.startsWith('data:')) {
      setImageSourceType('file');
    } else {
      setImageSourceType('url');
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to remove this product from the boutique catalog?')) {
      try {
        await deleteProduct(id);
        alert('Product removed');
        if (editingId === id) resetForm();
      } catch (err) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setCategory('Banarasi Fabric Works');
    setFabric('Cotton');
    setStock('10');
    setImageSourceType('file');
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await deliverOrder(orderId);
      alert('Order marked as delivered!');
      fetchOrders(); // Refresh order status in list
    } catch (err) {
      alert(err.message || 'Error updating order status');
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
      await payOrder(orderId);
      alert('UPI payment verified and marked as paid!');
      fetchOrders(); // Refresh order status in list
    } catch (err) {
      alert(err.message || 'Error updating payment status');
    }
  };

  // Metrics Calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.isPaid || o.paymentMethod === 'Cash on Delivery' || o.paymentMethod?.startsWith('UPI & QR Code') ? o.totalPrice : 0), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const currentMonthSales = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return orders.reduce((sum, o) => {
      const orderDate = new Date(o.createdAt);
      const isPaidOrCOD = o.isPaid || o.paymentMethod === 'Cash on Delivery' || o.paymentMethod?.startsWith('UPI & QR Code');
      const isCurrentMonth = orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
      return sum + (isPaidOrCOD && isCurrentMonth ? o.totalPrice : 0);
    }, 0);
  }, [orders]);

  // Category sales breakdown
  const categorySales = React.useMemo(() => {
    const breakdown = {
      'Banarasi Fabric Works': 0,
      'Amritsari Fabric Works': 0,
      'Ladies Purses': 0
    };
    orders.forEach(o => {
      o.orderItems.forEach(item => {
        const matchedProd = products.find(p => p._id === item.product);
        const category = matchedProd ? matchedProd.category : 'Banarasi Fabric Works';
        if (breakdown[category] !== undefined) {
          breakdown[category] += item.price * item.qty;
        } else {
          breakdown['Banarasi Fabric Works'] += item.price * item.qty;
        }
      });
    });
    return breakdown;
  }, [orders, products]);

  // Aggregate Customer Records
  const customerDatabase = React.useMemo(() => {
    const customers = {};
    orders.forEach(o => {
      const email = o.user?.email || o.shippingAddress?.email || 'guest@monikascreation.com';
      if (!customers[email]) {
        customers[email] = {
          name: o.user?.name || o.shippingAddress?.fullName || 'Guest Buyer',
          email: email,
          phone: o.user?.phone || 'N/A',
          ordersCount: 0,
          totalSpent: 0,
          cities: new Set(),
          addresses: new Set(),
          lastOrderDate: o.createdAt
        };
      }
      customers[email].ordersCount += 1;
      customers[email].totalSpent += o.totalPrice;
      if (o.shippingAddress?.city) {
        customers[email].cities.add(o.shippingAddress.city);
      }
      if (o.shippingAddress) {
        let addrStr = `${o.shippingAddress.address || ''}, ${o.shippingAddress.city || ''} - ${o.shippingAddress.postalCode || ''}`;
        const addrPhone = o.shippingAddress.phone || o.user?.phone;
        if (addrPhone && addrPhone !== 'N/A') {
          addrStr += ` (Phone: ${addrPhone})`;
        }
        customers[email].addresses.add(addrStr);
      }
      if (new Date(o.createdAt) > new Date(customers[email].lastOrderDate)) {
        customers[email].lastOrderDate = o.createdAt;
      }
    });
    return Object.values(customers).map(c => ({
      ...c,
      cities: Array.from(c.cities).join(', '),
      addresses: Array.from(c.addresses)
    }));
  }, [orders]);

  const exportSalesToExcel = () => {
    // Only customers with actual sales (purchases)
    const salesCustomers = customerDatabase.filter(c => c.ordersCount > 0);
    
    if (salesCustomers.length === 0) {
      alert('No sales data available to export.');
      return;
    }
    
    // Headers matching requirements
    const headers = ['Customer Name', 'Email Address', 'Phone Number', 'Orders Placed', 'Total Contribution (INR)', 'Shipping Address(es)', 'Last Active'];
    
    // Process rows with CSV safe escapes
    const rows = salesCustomers.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone && c.phone !== '0000000000' ? c.phone : 'N/A').replace(/"/g, '""')}"`,
      c.ordersCount,
      c.totalSpent,
      `"${(c.addresses || []).join('; ').replace(/"/g, '""')}"`,
      `"${new Date(c.lastOrderDate).toLocaleDateString()}"`
    ]);
    
    // Compile CSV layout
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `monikas_creation_customer_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Alerts & Notifications
  const notifications = React.useMemo(() => {
    const list = [];
    
    // Low stock alerts
    products.forEach(p => {
      if (p.stock <= 3) {
        list.push({
          type: 'warning',
          message: `⚠️ Low Stock: "${p.name}" has only ${p.stock} items left in stock.`,
          actionTab: 'catalog'
        });
      }
    });

    // Pending orders alerts
    orders.forEach(o => {
      if (!o.isDelivered) {
        list.push({
          type: 'info',
          message: `📦 Pending Dispatch: Order #${o._id.substr(-6).toUpperCase()} by ${o.shippingAddress?.fullName || 'Guest'} needs delivery.`,
          actionTab: 'orders'
        });
      }
    });

    return list;
  }, [products, orders]);

  // Filtered customer list
  const filteredCustomers = customerDatabase.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <div>
          <span className="section-tag">Namaste, Owner</span>
          <h1 className="admin-dashboard-title" style={{ margin: '6px 0 0' }}>Boutique Management</h1>
        </div>
        <div className="backend-badge" style={{ background: 'var(--primary)', border: '1px solid var(--accent)', padding: '6px 16px', fontSize: '0.85rem' }}>
          Database Mode: {backendStatus.type}
        </div>
      </div>

      {/* Metrics Row */}
      <section className="admin-stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Sales</span>
            <span className="stat-value">₹{totalSales}</span>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(74, 14, 78, 0.1)', color: 'var(--primary)' }}>
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sales in {new Date().toLocaleString('default', { month: 'long' })}</span>
            <span className="stat-value" style={{ color: 'var(--primary-dark)' }}>₹{currentMonthSales}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(216, 27, 96, 0.1)', color: 'var(--secondary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)' }}>
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Avg Order Value</span>
            <span className="stat-value">₹{avgOrderValue}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(46, 125, 50, 0.1)', color: 'var(--success)' }}>
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Catalog Items</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
        </div>
      </section>

      {/* Dynamic Alerts Desk */}
      {notifications.length > 0 && (
        <div style={{
          background: 'rgba(239, 83, 80, 0.04)',
          border: '1px solid rgba(239, 83, 80, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--error)', margin: 0, fontWeight: '800' }}>
              <AlertCircle size={18} /> Boutique Alerts Desk ({notifications.length})
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
            {notifications.map((n, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--card-bg)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${n.type === 'warning' ? 'var(--warning)' : 'var(--primary-light)'}`,
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-color)', fontWeight: '600' }}>{n.message}</span>
                <button 
                  onClick={() => setActiveTab(n.actionTab)} 
                  className="btn btn-outline btn-xs"
                  style={{ textTransform: 'none', height: 'auto', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '700' }}
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Switcher Navigation */}
      <div className="admin-tabs-nav">
        <button 
          onClick={() => setActiveTab('catalog')} 
          className={`admin-tab-btn-main ${activeTab === 'catalog' ? 'active' : ''}`}
        >
          <Layers size={18} /> Catalog & Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`admin-tab-btn-main ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} /> Orders Dispatch ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`admin-tab-btn-main ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={18} /> Sales Analytics
        </button>
        <button 
          onClick={() => setActiveTab('customers')} 
          className={`admin-tab-btn-main ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <Users size={18} /> Customers Database ({customerDatabase.length})
        </button>
        <button 
          onClick={() => setActiveTab('coupons')} 
          className={`admin-tab-btn-main ${activeTab === 'coupons' ? 'active' : ''}`}
        >
          🎁 Launch Coupons ({coupons.length})
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`admin-tab-btn-main ${activeTab === 'settings' ? 'active' : ''}`}
        >
          ⚙️ UPI Settings
        </button>
      </div>

      {/* Conditional Rendering of Dashboard Views */}
      {activeTab === 'catalog' && (
        <div className="admin-layout-columns">
          {/* Left: Form */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <h3 className="admin-panel-title">
                {editingId ? '✍️ Edit Boutique Product' : '✨ Add New Product'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="btn btn-outline btn-sm">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="auth-label">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Gold Zari Saree"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label className="auth-label">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="8500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="auth-label">Stock Units</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label className="auth-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Banarasi Fabric Works">Banarasi Fabric Works</option>
                    <option value="Amritsari Fabric Works">Amritsari Fabric Works</option>
                    <option value="Ladies Purses">Ladies Purses</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="auth-label">Fabric / Materials</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Silk, Georgette, Velvet"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="auth-label">Product Image</label>
                
                {/* Switcher Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => { setImageSourceType('file'); setImage(''); }}
                    className={`btn btn-sm ${imageSourceType === 'file' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, textTransform: 'none', fontSize: '0.8rem', padding: '6px 12px', height: 'auto', fontWeight: '600' }}
                  >
                    📁 Upload Image File
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageSourceType('url'); setImage(''); }}
                    className={`btn btn-sm ${imageSourceType === 'url' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, textTransform: 'none', fontSize: '0.8rem', padding: '6px 12px', height: 'auto', fontWeight: '600' }}
                  >
                    🔗 Paste Image URL
                  </button>
                </div>

                {imageSourceType === 'file' ? (
                  <div className="file-upload-zone" style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: 'rgba(74, 14, 78, 0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    {image ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <img src={image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>✓ Image uploaded successfully</span>
                        <button type="button" onClick={() => setImage('')} className="btn btn-outline btn-xs" style={{ fontSize: '0.7rem', padding: '4px 8px', textTransform: 'none', height: 'auto', fontWeight: '600' }}>
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', marginBottom: '4px', fontWeight: '600' }}>
                          Drag & drop or click to choose an image file
                        </p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (Max 2MB)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste direct unsplash / web image URL..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="form-input"
                    />
                    {image && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={image} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image URL Preview</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="auth-label">Detailed Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe threadwork, motifs, borders, occasion suitability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                <PlusCircle size={18} /> {editingId ? 'Update Product Details' : 'Publish Product'}
              </button>
            </form>
          </div>

          {/* Right: Catalog */}
          <div className="admin-panel-card">
            <h3 className="admin-panel-title" style={{ marginBottom: '20px' }}>Catalog Manager ({products.length})</h3>
            <div className="admin-items-list">
              {products.map((p) => (
                <div key={p._id} className="admin-item-row">
                  <img src={p.image} alt={p.name} className="admin-item-thumb" />
                  <div>
                    <h4 className="admin-item-name" title={p.name}>{p.name}</h4>
                    <span className="admin-item-category">{p.category.split(' ')[0]} • Stock: {p.stock}</span>
                  </div>
                  <span className="admin-item-price">₹{p.price}</span>
                  <div className="admin-item-actions">
                    <button onClick={() => handleEditClick(p)} className="admin-action-btn btn-edit-action" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteClick(p._id)} className="admin-action-btn btn-delete-action" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-panel-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 className="admin-panel-title" style={{ marginBottom: '20px' }}>Orders Dispatch Desk ({orders.length})</h3>
          
          {ordersLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="admin-orders-list">
              {orders.map((o) => (
                <div key={o._id} className="admin-order-card">
                  <div className="admin-order-header">
                    <span>Order ID: #{o._id.substr(-6).toUpperCase()}</span>
                    <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="admin-order-buyer">
                    Buyer: {o.user?.name || o.shippingAddress?.fullName || 'Guest User'} ({o.user?.email || 'N/A'})
                  </div>
                  <div style={{ fontSize: '0.82rem', marginTop: '2px', color: 'var(--text-color)' }}>
                    Payment Mode: <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{o.paymentMethod}</span>
                  </div>
                  <div className="admin-order-items">
                    Items: {o.orderItems.map(item => `${item.name} (x${item.qty})`).join(', ')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Ship To: {o.shippingAddress.address}, {o.shippingAddress.city}, {o.shippingAddress.postalCode} 
                    {(o.shippingAddress.phone || o.user?.phone) && ` (Phone: ${o.shippingAddress.phone || o.user.phone})`}
                  </div>
                  {o.couponCode && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🎁 Coupon Applied: {o.couponCode} (-₹{o.discountPrice})</span>
                    </div>
                  )}
                  <div className="admin-order-footer">
                    <span className="admin-order-total">Total: ₹{o.totalPrice}</span>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge-status ${o.isPaid ? 'completed' : o.paymentMethod === 'Cash on Delivery' ? 'pending' : o.paymentMethod?.startsWith('UPI') ? 'warning' : 'pending'}`}>
                        {o.isPaid ? 'Paid & Verified' : o.paymentMethod === 'Cash on Delivery' ? 'COD (Pending)' : 'UPI Unverified'}
                      </span>
                      
                      {!o.isPaid && o.paymentMethod?.startsWith('UPI') && (
                        <button 
                          onClick={() => handleMarkAsPaid(o._id)} 
                          className="btn btn-primary" 
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            background: 'var(--success)',
                            borderColor: 'var(--success)',
                            boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)'
                          }}
                        >
                          Verify Payment
                        </button>
                      )}

                      {o.isDelivered ? (
                        <span className="badge-status completed">Delivered</span>
                      ) : (
                        <button onClick={() => handleMarkAsDelivered(o._id)} className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <AlertCircle size={32} style={{ marginBottom: '10px', color: 'var(--border-color)' }} />
              <p>No orders have been received yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-grid-2">
          {/* Left Side: Category Breakdown */}
          <div className="analytics-card">
            <h3 className="analytics-title">📊 Revenue by Product Category</h3>
            <div className="progress-list">
              {Object.entries(categorySales).map(([catName, amount]) => {
                const total = Object.values(categorySales).reduce((a, b) => a + b, 0);
                const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
                
                // Color mapping
                let barColor = 'var(--primary)';
                if (catName.includes('Banarasi')) barColor = 'var(--accent)';
                if (catName.includes('Amritsari')) barColor = 'var(--secondary)';
                
                return (
                  <div key={catName} className="progress-item">
                    <div className="progress-label-row">
                      <span style={{ color: 'var(--text-color)' }}>{catName}</span>
                      <span>₹{amount} ({percent}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${percent}%`, background: barColor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '40px', padding: '16px', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '8px', fontWeight: '700' }}>
                💡 Quick Analysis Insights
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Banarasi fabric items continue to drive the highest order values, followed closely by Ladies Bridal Clutches and Purses. Consider expanding inventory in hot Banarasi silk categories to match shopper demand.
              </p>
            </div>
          </div>

          {/* Right Side: sales distribution list */}
          <div className="analytics-card">
            <h3 className="analytics-title">🎯 Boutique Growth Targets</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div className="progress-label-row">
                  <span>Monthly Revenue Milestone</span>
                  <span>₹{totalSales} / ₹5,00,000</span>
                </div>
                <div className="progress-bar-track" style={{ marginTop: '8px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min(100, Math.round((totalSales / 500000) * 100))}%`, background: 'var(--accent)' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="progress-label-row">
                  <span>Completed Delivery Rate</span>
                  <span>
                    {orders.filter(o => o.isDelivered).length} / {orders.length} Orders
                  </span>
                </div>
                <div className="progress-bar-track" style={{ marginTop: '8px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${orders.length > 0 ? Math.round((orders.filter(o => o.isDelivered).length / orders.length) * 100) : 0}%`, 
                      background: 'var(--success)' 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '40px', background: 'var(--bg-color)', border: 'none', boxShadow: 'none' }}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(74, 14, 78, 0.05)' }}>
                <CheckCircle size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active Customer Count</span>
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>{customerDatabase.length} Accounts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="admin-panel-card">
          <h3 className="admin-panel-title" style={{ marginBottom: '20px' }}>👥 Boutique Customer Database</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div className="customer-search-bar" style={{ margin: '0', flex: '1', maxWidth: '360px' }}>
              <input 
                type="text"
                placeholder="Search by Name or Email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="customer-search-input"
              />
              <Search size={18} className="customer-search-icon" />
            </div>
            
            <button 
              onClick={exportSalesToExcel} 
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                background: 'linear-gradient(135deg, #1D7842, #107C41)',
                borderColor: '#107C41',
                boxShadow: '0 4px 12px rgba(16, 124, 65, 0.2)'
              }}
            >
              <FileSpreadsheet size={16} /> Export Sales to Excel
            </button>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email Address</th>
                    <th>Orders Placed</th>
                    <th>Total Contribution</th>
                    <th>Shipping Address(es)</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust, i) => (
                    <tr key={i}>
                      <td>
                        <div className="customer-profile-cell">
                          <div className="avatar-circle-sm">
                            {cust.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2)}
                          </div>
                          <span style={{ fontWeight: '700' }}>{cust.name}</span>
                        </div>
                      </td>
                      <td>
                        <div>{cust.email}</div>
                        {cust.phone && cust.phone !== 'N/A' && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '700' }}>
                            📞 {cust.phone}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{cust.ordersCount}</td>
                      <td>
                        <span className="spent-badge-rupee">₹{cust.totalSpent}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '320px' }}>
                          {cust.addresses && cust.addresses.length > 0 ? (
                            cust.addresses.map((addr, idx) => (
                              <div key={idx} style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                background: 'rgba(124, 45, 130, 0.03)',
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                lineHeight: '1.3'
                              }}>
                                {addr}
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No address recorded</span>
                          )}
                        </div>
                      </td>
                      <td className="customer-metadata-cell">
                        {new Date(cust.lastOrderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <AlertCircle size={32} style={{ marginBottom: '10px', color: 'var(--border-color)' }} />
              <p>No customer profiles found matching "{customerSearch}"</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
          {/* Left Column: Create Coupon Form */}
          <div className="admin-panel-card" style={{ padding: '24px' }}>
            <h3 className="admin-panel-title" style={{ marginBottom: '20px', fontSize: '1.25rem' }}>🎁 Launch Coupon</h3>
            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="auth-form-group">
                <label className="auth-label">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Discount Type</label>
                <select
                  value={couponDiscountType}
                  onChange={(e) => setCouponDiscountType(e.target.value)}
                  className="form-input"
                  style={{ background: 'var(--card-bg)' }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Discount Value</label>
                <input
                  type="number"
                  placeholder={couponDiscountType === 'percentage' ? 'e.g. 15' : 'e.g. 250'}
                  value={couponDiscountValue}
                  onChange={(e) => setCouponDiscountValue(e.target.value)}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Minimum Purchase Required (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000 (0 for no limit)"
                  value={couponMinPurchase}
                  onChange={(e) => setCouponMinPurchase(e.target.value)}
                  className="form-input"
                  min="0"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
                disabled={submittingCoupon}
              >
                {submittingCoupon ? 'Launching...' : 'Launch Coupon Code'}
              </button>
            </form>
          </div>

          {/* Right Column: Coupon list table */}
          <div className="admin-panel-card" style={{ padding: '24px' }}>
            <h3 className="admin-panel-title" style={{ marginBottom: '20px', fontSize: '1.25rem' }}>🎫 Campaign Coupon Codes</h3>
            {couponsLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading coupons...</p>
            ) : coupons.length > 0 ? (
              <div className="customers-table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Type</th>
                      <th>Discount</th>
                      <th>Min Purchase</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td>
                          <span style={{ fontWeight: '700', letterSpacing: '0.5px', color: 'var(--primary)' }}>
                            {coupon.code}
                          </span>
                        </td>
                        <td>
                          <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {coupon.discountType}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: '600' }}>
                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                          </span>
                        </td>
                        <td>₹{coupon.minPurchase || 0}</td>
                        <td>
                          <button
                            onClick={() => handleToggleCoupon(coupon._id)}
                            style={{
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              background: coupon.isActive ? 'rgba(46, 125, 50, 0.1)' : 'rgba(198, 40, 40, 0.1)',
                              color: coupon.isActive ? 'var(--success)' : 'var(--error)'
                            }}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteCoupon(coupon._id)}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: 'var(--error)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete Coupon"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <AlertCircle size={32} style={{ marginBottom: '10px', color: 'var(--border-color)' }} />
                <p>No active coupon codes found. Use the form on the left to launch one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="admin-panel-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 className="admin-panel-title" style={{ marginBottom: '20px' }}>⚙️ UPI & QR Code Settings</h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            updateUpiSettings(settingsUpi, qrSourceType === 'none' ? '' : settingsQr);
            alert('UPI and QR Code settings updated successfully!');
          }}>
            <div className="auth-form-group">
              <label className="auth-label">Shop UPI ID / Address</label>
              <input
                type="text"
                placeholder="e.g. sethswayam21@okaxis"
                value={settingsUpi}
                onChange={(e) => setSettingsUpi(e.target.value)}
                className="form-input"
                required
              />
              <span className="form-help" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Payments from checkout will be routed directly to this UPI address.
              </span>
            </div>

            <div className="auth-form-group" style={{ marginTop: '20px' }}>
              <label className="auth-label">QR Code Source</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="qrSource"
                    checked={qrSourceType === 'none'}
                    onChange={() => setQrSourceType('none')}
                  />
                  Smart Dynamic QR (Pre-fills amount)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="qrSource"
                    checked={qrSourceType === 'file'}
                    onChange={() => setQrSourceType('file')}
                  />
                  Upload Custom QR Code Image
                </label>
              </div>
            </div>

            {qrSourceType === 'file' && (
              <div style={{ marginTop: '16px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '16px', background: 'rgba(0,0,0,0.01)' }}>
                <div className="auth-form-group">
                  <label className="auth-label">Upload QR Code Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSettingsQr(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="form-input"
                    style={{ padding: '8px' }}
                  />
                </div>

                {settingsQr && (
                  <div style={{ marginTop: '14px', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>QR Code Preview:</span>
                    <img
                      src={settingsQr}
                      alt="Custom QR Preview"
                      style={{ maxWidth: '140px', maxHeight: '140px', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#fff', padding: '6px' }}
                    />
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '30px', padding: '12px' }}
            >
              Save Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

