import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const API_URL = '/api';

export default function Login() {
  const { loginUser, registerUser, logoutUser, userInfo } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State: 'login', 'register', or 'admin'
  const [activeTab, setActiveTab] = useState('login');

  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Get redirect path
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) navigate('/admin');
      else navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setErrorMsg(''); setSuccessMsg('');
  };

  // Final Registration/Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      if (activeTab === 'login') {
        if (!email.trim() || !password.trim()) throw new Error('Please fill in all login fields.');
        await loginUser(email, password);
      } else if (activeTab === 'admin') {
        if (!email.trim() || !password.trim()) throw new Error('Please fill in all login fields.');
        const result = await loginUser(email, password);
        if (result && result.user && !result.user.isAdmin) {
          logoutUser();
          throw new Error('Access Denied: Customer credentials cannot access the Admin Portal.');
        }
      } else {
        // Register tab: Directly register without OTP check
        if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all fields.');
        }
        await registerUser(name, email, password, phone);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper container animate-fade">
      <div className="auth-card-container glass-panel">

        {/* Tabs */}
        <div className="auth-tabs">
          <button onClick={() => switchTab('login')} className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}>
            Sign In
          </button>
          <button onClick={() => switchTab('register')} className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}>
            Register
          </button>
          <button onClick={() => switchTab('admin')} className={`auth-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}>
            Admin Portal
          </button>
        </div>

        {/* Error / Success banners */}
        {errorMsg && <div className="error-banner">{errorMsg}</div>}
        {successMsg && !errorMsg && (
          <div style={{
            background: 'rgba(46, 125, 50, 0.08)',
            border: '1px solid rgba(46, 125, 50, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.85rem',
            color: 'var(--success)',
            marginBottom: '16px',
            fontWeight: '600'
          }}>{successMsg}</div>
        )}

        {/* Admin notice */}
        {activeTab === 'admin' && (
          <div style={{
            marginBottom: '20px', padding: '12px 16px',
            background: 'rgba(74, 14, 78, 0.05)', borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(124, 45, 130, 0.2)', fontSize: '0.8rem',
            color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span>🔐</span>
            <span><strong>Administrator Access:</strong> Only verified admin credentials can access the boutique management console.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* ===== REGISTER TAB ===== */}
          {activeTab === 'register' && (
            <>
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text" placeholder="Enter your full name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="form-input" required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <input
                  type="tel" placeholder="10-digit mobile number"
                  value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-input" pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <input
                  type="email" placeholder="name@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="form-input" required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <input
                  type="password" placeholder="Min 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="form-input" required
                />
              </div>
            </>
          )}

          {/* ===== LOGIN & ADMIN TABS ===== */}
          {(activeTab === 'login' || activeTab === 'admin') && (
            <>
              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <input
                  type="email" placeholder="name@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="form-input" required
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <input
                  type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="form-input" required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? 'Please wait...'
              : activeTab === 'login' ? 'Sign In'
              : activeTab === 'admin' ? 'Admin Login'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
