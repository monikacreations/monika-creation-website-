import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

// Local mock data in case the backend server is offline
const localMockProducts = [
  {
    _id: 'prod_banarasi_001',
    name: 'Royal Banarasi Silk Saree',
    description: 'A stunning royal Banarasi saree handwoven with pure zari and katan silk. Featuring classic floral jaal work, an elegant border, and a rich pallu, perfect for weddings and festive occasions.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Banarasi Fabric Works',
    fabric: 'Katan Silk',
    stock: 10,
    rating: 4.8,
    numReviews: 12,
    reviews: [
      { _id: 'rev_1', name: 'Anjali Gupta', rating: 5, comment: 'Absolutely beautiful! The fabric quality is superb.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_banarasi_002',
    name: 'Khaddi Georgette Banarasi Saree',
    description: 'An exquisite khaddi georgette saree in deep emerald green, handwoven with silver zari motifs. Lightweight, flowy, and traditionally styled for modern elegance.',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Banarasi Fabric Works',
    fabric: 'Khaddi Georgette',
    stock: 8,
    rating: 4.6,
    numReviews: 8,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_amritsari_001',
    name: 'Premium Phulkari Dupatta',
    description: 'Traditional Phulkari embroidery on premium cotton. Intricate geometric patterns hand-embroidered by local Punjabi artisans using vibrant silk threads. Perfect accent for any plain salwar suit.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Chanderi Cotton',
    stock: 15,
    rating: 4.9,
    numReviews: 24,
    reviews: [
      { _id: 'rev_3', name: 'Simran Kaur', rating: 5, comment: 'Authentic Phulkari work. Reminds me of Punjab. Love it!', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_amritsari_002',
    name: 'Lavender Patiala Salwar Suit',
    description: 'A full suit set featuring a Lavender Kurta with delicate hand-embroidery and a heavy Patiala Salwar, paired with a matching Phulkari chiffon dupatta. Unstitched fabric for a custom fit.',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Pure Crepe',
    stock: 5,
    rating: 4.5,
    numReviews: 6,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_purse_001',
    name: 'Bridal Velvet Potli Bag',
    description: 'A luxurious ruby red velvet potli bag decorated with pearls, beads, sequins, and gold embroidery. Features a secure drawstring closure and a pearl handle, ideal for brides and bridesmaids.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Velvet & Pearls',
    stock: 20,
    rating: 4.7,
    numReviews: 15,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_purse_002',
    name: 'Zardozi Silk Box Clutch',
    description: 'An elegant box clutch made of raw silk featuring intricate gold Zardozi hand-embroidery. Includes a detachable metal chain strap. Large enough to carry your phone and essentials.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Raw Silk & Zardozi',
    stock: 12,
    rating: 4.4,
    numReviews: 9,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_purse_003',
    name: 'Brocade Floral Potli Bag',
    description: 'A stylish potli bag crafted from authentic Banarasi brocade fabric with golden floral patterns, gold tassel tie strings, and a comfortable wrist handle.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Ladies Purses',
    fabric: 'Banarasi Brocade',
    stock: 25,
    rating: 4.3,
    numReviews: 7,
    reviews: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod_amritsari_003',
    name: 'Mustard Phulkari Kurti',
    description: 'Mustard yellow linen kurti featuring beautiful Phulkari patchworks and neckline hand embroidery. Comfort fit for casual elegance.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'
    ],
    category: 'Amritsari Fabric Works',
    fabric: 'Pure Linen',
    stock: 7,
    rating: 4.7,
    numReviews: 11,
    reviews: [],
    createdAt: new Date().toISOString()
  }
];

export const ShopContextProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // State Declarations
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('localProducts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return localMockProducts;
      }
    }
    return localMockProducts;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, type: 'Local Simulation' });
  
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Auth State
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Mock Orders State (in case backend is down)
  const [localOrders, setLocalOrders] = useState(() => {
    const saved = localStorage.getItem('localOrders');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // UPI Settings State
  const [upiId, setUpiId] = useState(localStorage.getItem('upiId') || 'sethswayam21@okaxis');
  const [qrCode, setQrCode] = useState(localStorage.getItem('qrCode') || '');

  const updateUpiSettings = (newUpiId, newQrCode) => {
    setUpiId(newUpiId);
    localStorage.setItem('upiId', newUpiId);
    setQrCode(newQrCode);
    localStorage.setItem('qrCode', newQrCode);
  };

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync Cart Items to LocalStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync Local Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem('localOrders', JSON.stringify(localOrders));
  }, [localOrders]);

  // Test backend status and fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('API server unreachable');
      }
      const data = await response.json();
      setProducts(data);
      localStorage.setItem('localProducts', JSON.stringify(data));
      setBackendStatus({ online: true, type: 'Full Database' });
      setError(null);
    } catch (err) {
      console.log('Backend offline or unreachable. Using offline simulated mode.', err.message);
      const saved = localStorage.getItem('localProducts');
      if (saved) {
        try {
          setProducts(JSON.parse(saved));
        } catch (e) {
          setProducts(localMockProducts);
        }
      } else {
        setProducts(localMockProducts);
      }
      setBackendStatus({ online: false, type: 'Local Simulation (Offline)' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('API server unreachable');
      }

      const data = await response.json();
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      console.warn('API login failed, checking local fallback credentials.', err.message);
      
      const normalizedEmail = email.trim().toLowerCase();
      
      // Local Auth simulation (supporting both seed owner and common admin test credentials)
      const isOwner = normalizedEmail === 'sethswayam21@gmail.com' && password === 'Monik@6306';
      const isTestAdmin = (normalizedEmail === 'admin@gmail.com' || normalizedEmail === 'admin@monikascreation.com' || normalizedEmail === 'admin') && password === 'admin123';
      
      if (isOwner || isTestAdmin) {
        const mockAdmin = {
          _id: 'user_owner_id_003',
          name: isOwner ? "Monika's Creation Owner" : "Simulated Admin",
          email: isOwner ? 'sethswayam21@gmail.com' : normalizedEmail,
          isAdmin: true,
          token: 'mock-jwt-owner-token'
        };
        setUserInfo(mockAdmin);
        localStorage.setItem('userInfo', JSON.stringify(mockAdmin));
        return { success: true, user: mockAdmin };
      } else if (normalizedEmail === 'customer@gmail.com' && password === 'user123') {
        const mockUser = {
          _id: 'user_customer_id_002',
          name: 'Rahul Sharma',
          email: 'customer@gmail.com',
          isAdmin: false,
          token: 'mock-jwt-user-token'
        };
        setUserInfo(mockUser);
        localStorage.setItem('userInfo', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }

      // Check if it is a locally registered customer in localStorage
      const localUsers = localStorage.getItem('localUsers') ? JSON.parse(localStorage.getItem('localUsers')) : [];
      const matchedUser = localUsers.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
      if (matchedUser) {
        const mockUser = {
          _id: matchedUser._id,
          name: matchedUser.name,
          email: matchedUser.email,
          isAdmin: false,
          token: 'mock-jwt-registered-token'
        };
        setUserInfo(mockUser);
        localStorage.setItem('userInfo', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      
      // Prevent showing raw JSON parse errors to the user by sanitizing the error message
      let cleanMsg = err.message;
      if (cleanMsg.includes('Unexpected token') || cleanMsg.includes('not valid JSON') || cleanMsg.includes('JSON') || cleanMsg.includes('unreachable') || cleanMsg.includes('Failed to fetch')) {
        cleanMsg = 'Invalid email or password';
      }
      throw new Error(cleanMsg || 'Invalid email or password');
    }
  };

  const registerUser = async (name, email, password, phone) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('API server unreachable');
      }

      const data = await response.json();
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      console.warn('API registration failed, using local fallback registration.', err.message);
      
      const normalizedEmail = email.trim().toLowerCase();
      const localUsers = localStorage.getItem('localUsers') ? JSON.parse(localStorage.getItem('localUsers')) : [];
      
      if (localUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
        throw new Error('User already exists');
      }

      const newLocalUser = {
        _id: 'user_mock_' + Math.random().toString(36).substr(2, 9),
        name,
        email: normalizedEmail,
        password,
        phone,
        isAdmin: false
      };
      localUsers.push(newLocalUser);
      localStorage.setItem('localUsers', JSON.stringify(localUsers));

      const newMockUser = {
        _id: newLocalUser._id,
        name,
        email: normalizedEmail,
        phone,
        isAdmin: false,
        token: 'mock-jwt-registered-token-' + Date.now()
      };
      setUserInfo(newMockUser);
      localStorage.setItem('userInfo', JSON.stringify(newMockUser));
      return { success: true };
    }
  };

  const logoutUser = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    setCartItems([]);
  };

  // Cart Operations
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.product === product._id);
      if (existing) {
        return prev.map(item =>
          item.product === product._id
            ? { ...item, qty: Math.min(product.stock, item.qty + qty) }
            : item
        );
      }
      return [...prev, {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        stock: product.stock
      }];
    });
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map(item =>
        item.product === productId ? { ...item, qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.product !== productId));
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  // Product Admin Operations (CRUD simulated / API)
  const addProduct = async (productData) => {
    if (backendStatus.online) {
      try {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify(productData)
        });
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          let errorMsg = 'Failed to create product';
          if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            errorMsg = errData.message || errorMsg;
          }
          throw new Error(errorMsg);
        }

        if (contentType && contentType.includes('application/json')) {
          const serverProduct = await response.json();
          setProducts(prev => {
            const updated = [serverProduct, ...prev];
            localStorage.setItem('localProducts', JSON.stringify(updated));
            return updated;
          });
          return serverProduct;
        }
      } catch (err) {
        console.error('API create product failed:', err.message);
        throw err;
      }
    }

    // Offline fallback
    const newId = 'prod_local_' + Math.random().toString(36).substr(2, 9);
    const newLocalProduct = {
      _id: newId,
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      images: productData.images || [],
      rating: 4.5,
      numReviews: 0,
      reviews: [],
      createdAt: new Date().toISOString()
    };
    setProducts(prev => {
      const updated = [newLocalProduct, ...prev];
      localStorage.setItem('localProducts', JSON.stringify(updated));
      return updated;
    });
    return newLocalProduct;
  };

  const editProduct = async (id, productData) => {
    if (backendStatus.online) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: JSON.stringify(productData)
        });
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          let errorMsg = 'Failed to update product';
          if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            errorMsg = errData.message || errorMsg;
          }
          throw new Error(errorMsg);
        }

        if (contentType && contentType.includes('application/json')) {
          const serverProduct = await response.json();
          setProducts(prev => {
            const updated = prev.map(p => p._id === id ? serverProduct : p);
            localStorage.setItem('localProducts', JSON.stringify(updated));
            return updated;
          });
          return serverProduct;
        }
      } catch (err) {
        console.error('API edit product failed:', err.message);
        throw err;
      }
    }

    // Offline fallback
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p._id === id) {
          return {
            ...p,
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock),
            images: productData.images || p.images || []
          };
        }
        return p;
      });
      localStorage.setItem('localProducts', JSON.stringify(updated));
      return updated;
    });
    return { _id: id, ...productData };
  };

  const deleteProduct = async (id) => {
    if (backendStatus.online) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`
          }
        });
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          let errorMsg = 'Failed to delete product';
          if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            errorMsg = errData.message || errorMsg;
          }
          throw new Error(errorMsg);
        }

        setProducts(prev => {
          const updated = prev.filter(p => p._id !== id);
          localStorage.setItem('localProducts', JSON.stringify(updated));
          return updated;
        });
        return true;
      } catch (err) {
        console.error('API delete product failed:', err.message);
        throw err;
      }
    }

    // Offline fallback
    setProducts(prev => {
      const updated = prev.filter(p => p._id !== id);
      localStorage.setItem('localProducts', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  // Order Operations
  const placeOrder = async (orderData) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to place order');
      const data = await response.json();
      
      // Update stock locally
      await fetchProducts();
      setCartItems([]);
      setAppliedCoupon(null);
      return data;
    } catch (err) {
      console.warn('Could not save order on database, creating local mock order.', err.message);
      const newMockOrder = {
        _id: 'order_local_' + Math.random().toString(36).substr(2, 9),
        user: {
          _id: userInfo?._id || 'guest_id',
          name: userInfo?.name || 'Guest User',
          email: userInfo?.email || 'guest@gmail.com'
        },
        ...orderData,
        isPaid: false,
        isDelivered: false,
        createdAt: new Date().toISOString()
      };

      // Deduct stock locally
      setProducts(prev => prev.map(p => {
        const itemOrdered = orderData.orderItems.find(item => item.product === p._id);
        if (itemOrdered) {
          return { ...p, stock: Math.max(0, p.stock - itemOrdered.qty) };
        }
        return p;
      }));

      setLocalOrders(prev => [newMockOrder, ...prev]);
      setCartItems([]);
      setAppliedCoupon(null);
      return newMockOrder;
    }
  };

  const getOrderDetails = async (id) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch order details');
      return await response.json();
    } catch (err) {
      console.warn('API get order details failed. Reading from local memory.', err.message);
      const order = localOrders.find(o => o._id === id);
      if (order) return order;
      throw new Error('Order not found');
    }
  };

  const payOrder = async (id) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/orders/${id}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to update payment status');
      return await response.json();
    } catch (err) {
      console.warn('API pay order failed. Updating local memory.', err.message);
      let updatedOrder = null;
      setLocalOrders(prev => prev.map(o => {
        if (o._id === id) {
          updatedOrder = { ...o, isPaid: true, paidAt: new Date().toISOString() };
          return updatedOrder;
        }
        return o;
      }));
      return updatedOrder;
    }
  };

  const deliverOrder = async (id) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to update delivery status');
      return await response.json();
    } catch (err) {
      console.warn('API deliver order failed. Updating local memory.', err.message);
      let updatedOrder = null;
      setLocalOrders(prev => prev.map(o => {
        if (o._id === id) {
          updatedOrder = { ...o, isDelivered: true, deliveredAt: new Date().toISOString() };
          return updatedOrder;
        }
        return o;
      }));
      return updatedOrder;
    }
  };

  const getAllOrders = async () => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch all orders');
      return await response.json();
    } catch (err) {
      console.warn('API get all orders failed. Returning local orders.', err.message);
      return localOrders;
    }
  };

  const getAllUsers = async () => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch all users');
      return await response.json();
    } catch (err) {
      console.warn('API get all users failed. Returning local users.', err.message);
      const localUsers = localStorage.getItem('localUsers') ? JSON.parse(localStorage.getItem('localUsers')) : [];
      const defaultUsers = [
        { _id: 'user_owner_id_003', name: "Monika's Creation Owner", email: 'sethswayam21@gmail.com', phone: '0000000000', isAdmin: true, createdAt: new Date().toISOString() },
        { _id: 'user_customer_id_002', name: 'Rahul Sharma', email: 'customer@gmail.com', phone: '9876543210', isAdmin: false, createdAt: new Date().toISOString() }
      ];
      const allUsers = [...defaultUsers];
      localUsers.forEach(lu => {
        if (!allUsers.some(u => u.email.toLowerCase() === lu.email.toLowerCase())) {
          allUsers.push({
            _id: lu._id,
            name: lu.name,
            email: lu.email,
            phone: lu.phone,
            isAdmin: lu.isAdmin,
            createdAt: lu.createdAt || new Date().toISOString()
          });
        }
      });
      return allUsers;
    }
  };

  // Coupon Admin & Checkout Operations
  const getCoupons = async () => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');
      const response = await fetch(`${API_URL}/coupons`, {
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch coupons');
      return await response.json();
    } catch (err) {
      console.warn('API error fetching coupons, returning local simulated coupons.', err.message);
      const defaultMock = [
        { _id: 'coupon_mock_1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 1000, isActive: true },
        { _id: 'coupon_mock_2', code: 'MONIKA500', discountType: 'flat', discountValue: 500, minPurchase: 5000, isActive: true }
      ];
      const local = localStorage.getItem('localCoupons');
      if (!local) {
        localStorage.setItem('localCoupons', JSON.stringify(defaultMock));
        return defaultMock;
      }
      return JSON.parse(local);
    }
  };

  const createCoupon = async (couponData) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');
      const response = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(couponData)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create coupon');
      }
      return await response.json();
    } catch (err) {
      console.warn('API error creating coupon, saving in local simulated storage.', err.message);
      const coupons = await getCoupons();
      const codeUpper = couponData.code.trim().toUpperCase();
      if (coupons.some(c => c.code === codeUpper)) {
        throw new Error('Coupon code already exists');
      }
      const newCoupon = {
        _id: 'coupon_local_' + Math.random().toString(36).substr(2, 9),
        code: codeUpper,
        discountType: couponData.discountType,
        discountValue: Number(couponData.discountValue),
        minPurchase: Number(couponData.minPurchase || 0),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      const updated = [newCoupon, ...coupons];
      localStorage.setItem('localCoupons', JSON.stringify(updated));
      return newCoupon;
    }
  };

  const toggleCoupon = async (id) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to toggle coupon status');
      return await response.json();
    } catch (err) {
      console.warn('API error toggling coupon status, updating in local simulated storage.', err.message);
      const coupons = await getCoupons();
      const updated = coupons.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c);
      localStorage.setItem('localCoupons', JSON.stringify(updated));
      return updated.find(c => c._id === id);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete coupon');
      return await response.json();
    } catch (err) {
      console.warn('API error deleting coupon, updating in local simulated storage.', err.message);
      const coupons = await getCoupons();
      const updated = coupons.filter(c => c._id !== id);
      localStorage.setItem('localCoupons', JSON.stringify(updated));
      return { success: true };
    }
  };

  const validateCoupon = async (code, subtotal) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');
      const response = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, subtotal })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Invalid coupon');
      }
      return await response.json();
    } catch (err) {
      console.warn('API error validating coupon, checking local simulated storage.', err.message);
      const coupons = await getCoupons();
      const coupon = coupons.find(c => c.code === code.trim().toUpperCase());
      if (!coupon) throw new Error('Invalid coupon code');
      if (!coupon.isActive) throw new Error('This coupon is no longer active');
      if (subtotal < coupon.minPurchase) {
        throw new Error(`Minimum purchase of ₹${coupon.minPurchase} is required for this coupon`);
      }
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discountAmount = coupon.discountValue;
      }
      discountAmount = Math.min(discountAmount, subtotal);
      return {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      };
    }
  };

  const addProductReview = async (id, reviewData) => {
    try {
      if (!backendStatus.online) throw new Error('Offline mode active');

      const response = await fetch(`${API_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || 'Failed to submit review');
      }
      await fetchProducts(); // Refresh list to get updated rating
      return { success: true };
    } catch (err) {
      console.warn('Could not post review to API, simulating in local memory.', err.message);
      setProducts(prev => prev.map(p => {
        if (p._id === id) {
          const newReview = {
            _id: 'rev_local_' + Math.random().toString(36).substr(2, 9),
            name: userInfo?.name || 'Anonymous User',
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
            createdAt: new Date().toISOString()
          };
          const updatedReviews = [...p.reviews, newReview];
          const newRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            numReviews: updatedReviews.length,
            rating: Number(newRating.toFixed(1))
          };
        }
        return p;
      }));
      return { success: true };
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        error,
        backendStatus,
        theme,
        toggleTheme,
        userInfo,
        loginUser,
        registerUser,
        logoutUser,
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        getCartCount,
        getCartTotal,
        addProduct,
        editProduct,
        deleteProduct,
        placeOrder,
        getOrderDetails,
        payOrder,
        deliverOrder,
        getAllOrders,
        getAllUsers,
        addProductReview,
        appliedCoupon,
        setAppliedCoupon,
        getCoupons,
        createCoupon,
        toggleCoupon,
        deleteCoupon,
        validateCoupon,
        upiId,
        qrCode,
        updateUpiSettings
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
