import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top container">
        {/* Brand Info */}
        <div className="footer-section brand-summary">
          <h3 className="footer-title">Monika's Creation</h3>
          <p className="footer-desc">
            Bridging the gap between the royal weaves of Banaras and the vibrant threads of Amritsar. 
            We specialize in pure silk sarees, handcrafted Patiala suits, Phulkari dupattas, and premium bridal purses.
          </p>
          <div className="trust-badge">
            <Award size={18} className="trust-badge-icon" />
            <span>100% Authentic Handloom & Handicrafts</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section links-section">
          <h4 className="footer-section-title">Shop Collections</h4>
          <ul className="footer-links">
            <li><Link to="/shop">All Collections</Link></li>
            <li><Link to="/shop?category=Banarasi Fabric Works">Banarasi Fabric Works</Link></li>
            <li><Link to="/shop?category=Amritsari Fabric Works">Amritsari Fabric Works</Link></li>
            <li><Link to="/shop?category=Ladies Purses">Ladies Purses & Clutches</Link></li>
          </ul>
        </div>

        {/* Store Location / Contact (From Business Card!) */}
        <div className="footer-section contact-section">
          <h4 className="footer-section-title">Visit Our Boutique</h4>
          <ul className="contact-info-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>37/47, Shivala Road, Kanpur, Uttar Pradesh</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <a href="tel:+916306863685">+91 6306863685</a>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <a href="mailto:Monika.s.creations8@gmail.com">Monika.s.creations8@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Store Hours & News */}
        <div className="footer-section hours-newsletter">
          <h4 className="footer-section-title">Boutique Hours</h4>
          <p className="hours-text">Monday - Saturday: 10:30 AM - 8:30 PM</p>
          <p className="hours-text">Sunday: By Appointment</p>
          
          <h4 className="footer-section-title newsletter-margin">Join Our Inner Circle</h4>
          <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email Address" className="form-input footer-input" />
            <button type="submit" className="btn btn-primary btn-sm footer-submit-btn">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>&copy; {new Date().getFullYear()} Monika's Creation. All Rights Reserved. Crafted with love.</p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
