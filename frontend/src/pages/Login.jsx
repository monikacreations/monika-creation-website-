import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const API_URL = 'http://localhost:5000/api';

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

  // OTP flow states
  const [otpStep, setOtpStep] = useState('form'); // 'form' | 'otp' | 'verified'
  const [otpInput, setOtpInput] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [demoOtp, setDemoOtp] = useState(null); // demo toast
  const [otpTimer, setOtpTimer] = useState(0); // countdown

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

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const resetRegisterFlow = () => {
    setOtpStep('form');
    setOtpInput('');
    setDemoOtp(null);
    setOtpTimer(0);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setErrorMsg(''); setSuccessMsg('');
    resetRegisterFlow();
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setErrorMsg('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      return setErrorMsg('Please fill in all fields before verifying your phone number.');
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return setErrorMsg('Please enter a valid 10-digit phone number.');
    }
    setOtpSending(true);
    try {
      const res = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpStep('otp');
      setOtpTimer(300); // 5 min countdown
      setSuccessMsg('OTP sent! Enter the code below to verify your number.');
      if (data.demoOtp) setDemoOtp(data.demoOtp); // demo mode
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    if (otpInput.length !== 6) {
      return setErrorMsg('Please enter the 6-digit OTP.');
    }
    setOtpVerifying(true);
    try {
      const res = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOtpStep('verified');
      setDemoOtp(null);
      setSuccessMsg('✅ Phone verified! Now complete your registration.');
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setOtpVerifying(false);
    }
  };

  // Step 3: Final Registration Submit
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
        // Register tab: OTP must be verified first
        if (otpStep !== 'verified') {
          throw new Error('Please verify your phone number with OTP before registering.');
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

        {/* Demo OTP Toast */}
        {demoOtp && (
          <div style={{
            marginBottom: '16px', padding: '14px 16px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.05))',
            border: '2px dashed var(--accent)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              📱 Demo Mode — OTP (SMS would be sent in production)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '8px', color: 'var(--primary)', fontFamily: 'monospace' }}>
              {demoOtp}
            </div>
            {otpTimer > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* ===== REGISTER TAB ===== */}
          {activeTab === 'register' && (
            <>
              {/* Step 1 & 2: Form + OTP Entry */}
              {otpStep !== 'verified' && (
                <>
                  <div className="auth-form-group">
                    <label className="auth-label">Full Name</label>
                    <input
                      type="text" placeholder="Enter your full name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="form-input" required disabled={otpStep === 'otp'}
                    />
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Phone Number</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="tel" placeholder="10-digit mobile number"
                        value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="form-input" pattern="[0-9]{10}"
                        style={{ flex: 1 }}
                        disabled={otpStep === 'otp'}
                        required
                      />
                      {otpStep === 'form' && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpSending || phone.length !== 10}
                          className="btn btn-outline"
                          style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '0 12px', height: '44px', flexShrink: 0 }}
                        >
                          {otpSending ? '...' : 'Send OTP'}
                        </button>
                      )}
                      {otpStep === 'otp' && (
                        <button
                          type="button"
                          onClick={() => resetRegisterFlow()}
                          className="btn btn-outline"
                          style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '0 10px', height: '44px', flexShrink: 0, color: 'var(--text-muted)' }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OTP Input Step */}
                  {otpStep === 'otp' && (
                    <div className="auth-form-group">
                      <label className="auth-label">Enter OTP</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text" placeholder="6-digit code"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="form-input"
                          style={{ flex: 1, letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1.1rem', textAlign: 'center' }}
                          maxLength={6}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpVerifying || otpInput.length !== 6}
                          className="btn btn-primary"
                          style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '0 12px', height: '44px', flexShrink: 0 }}
                        >
                          {otpVerifying ? '...' : 'Verify'}
                        </button>
                      </div>
                      {otpTimer === 0 && (
                        <button type="button" onClick={handleSendOtp} disabled={otpSending}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '6px', padding: 0 }}>
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}

                  <div className="auth-form-group">
                    <label className="auth-label">Email Address</label>
                    <input
                      type="email" placeholder="name@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="form-input" required disabled={otpStep === 'otp'}
                    />
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Password</label>
                    <input
                      type="password" placeholder="Min 6 characters"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="form-input" required disabled={otpStep === 'otp'}
                    />
                  </div>
                </>
              )}

              {/* Verified State Summary */}
              {otpStep === 'verified' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    background: 'rgba(46, 125, 50, 0.06)',
                    border: '1px solid rgba(46, 125, 50, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--success)' }}>✅ Phone Verified</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span>👤 {name}</span>
                      <span>📧 {email}</span>
                      <span>📱 +91 {phone} <span style={{ color: 'var(--success)', fontWeight: '700' }}>✓ Verified</span></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => resetRegisterFlow()}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', padding: 0, textDecoration: 'underline' }}
                  >
                    ← Edit details
                  </button>
                </div>
              )}
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

          {/* Submit button: for register, only show after OTP verified or in other tabs */}
          {(activeTab !== 'register' || otpStep === 'verified') && (
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
          )}
        </form>
      </div>
    </div>
  );
}
