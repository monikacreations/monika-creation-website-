import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Home() {
  const { products, addToCart, fetchProducts } = useContext(ShopContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Take first 4 items as featured products
  const featuredProducts = products.slice(0, 4);

  const categories = [
    {
      name: 'Banarasi Fabric Works',
      desc: 'Handwoven pure silk sarees and suits with gold zari brocades.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Banarasi Fabric Works'
    },
    {
      name: 'Amritsari Fabric Works',
      desc: 'Vibrant hand-embroidered Phulkari dupattas and Patiala suits.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Amritsari Fabric Works'
    },
    {
      name: 'Ladies Purses',
      desc: 'Luxurious velvet bridal potli bags and raw silk zardozi box clutches.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Ladies Purses'
    }
  ];

  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Decorative glowing background orbs */}
        <div className="glowing-orb orb-primary"></div>
        <div className="glowing-orb orb-secondary"></div>

        <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <span className="hero-tag">🌸 Handloom Heritage</span>
            <h1 className="hero-title">
              Exquisite Fabric Works & <span>Ladies Purses</span>
            </h1>
            <p className="hero-desc">
              Discover the classic royalty of Banarasi silk and the joyful colors of Amritsari Phulkari. 
              Each piece is meticulously curated and handcrafted for your special occasions.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Shop Collections <ArrowRight size={18} />
              </Link>
              <a href="#about-boutique" className="btn btn-outline">
                Our Story
              </a>
            </div>
          </div>
          <div className="hero-visuals">
            <img 
              src="/hero_new.jpg" 
              alt="Indian Silk Fabrics" 
              className="visual-image-main floating" 
            />
            <div className="visual-badge glass-panel">
              <span className="badge-number">100%</span>
              <span className="badge-text">Authentic<br />Handicraft</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Cards */}
      <section className="categories-showcase container reveal-element">
        <div className="section-header">
          <span className="section-tag">Browse Categories</span>
          <h2 className="section-title">Explore Our Curated Works</h2>
          <p className="section-desc">Handmade fabrics and bridal purses tailored for elegant celebrations and everyday statement styles.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link to={cat.link} key={i} className="category-card">
              <img src={cat.image} alt={cat.name} className="category-bg-image" />
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3 className="category-title">{cat.name}</h3>
                <p className="category-explore-link">Shop Collection <ArrowRight size={14} /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products reveal-element">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Handpicked For You</span>
            <h2 className="section-title">Bestsellers of the Season</h2>
            <p className="section-desc">Explore the most loved sarees, dupattas, and potli purses from our Kanpur store catalog.</p>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <Link to={`/product/${product._id}`}>
                    <img src={product.image} alt={product.name} className="product-img" />
                  </Link>
                  <span className="product-category-badge">{product.category.split(' ')[0]}</span>
                  {product.stock === 0 && (
                    <div className="out-of-stock-overlay">
                      <span className="out-of-stock-text">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="product-details-summary">
                  <span className="product-fabric-label">{product.fabric}</span>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="product-card-title">{product.name}</h3>
                  </Link>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star-icon ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}>★</span>
                    ))}
                    <span className="rating-count-text">({product.numReviews})</span>
                  </div>
                  <div className="product-card-footer">
                    <span className="product-card-price">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)} 
                      disabled={product.stock === 0}
                      className={`btn-card-add ${product.stock === 0 ? 'disabled' : ''}`}
                      title={product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/shop" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Boutique Value Props */}
      <section id="about-boutique" className="boutique-promo reveal-element">
        <div className="container promo-grid">
          <div className="promo-info-col">
            <h2 className="promo-title">Handcrafting Dreams Since Years</h2>
            <p className="promo-text">
              Monika's Creation started as a small, family boutique in Kanpur with a vision to sustain and showcase the artistry of local weavers. 
              Our Banarasi sarees are sourced directly from weavers in Varanasi, and Phulkari embroidery sets are crafted by women self-help groups in Amritsar.
            </p>
            <div className="value-props-list">
              <div className="value-prop-card">
                <Sparkles size={24} className="value-prop-icon" />
                <h4 className="value-prop-title">100% Silk & Cotton</h4>
                <p className="value-prop-desc">Pure quality threads sourced directly from handloom cooperatives.</p>
              </div>
              <div className="value-prop-card">
                <ShieldCheck size={24} className="value-prop-icon" />
                <h4 className="value-prop-title">Trusted Quality</h4>
                <p className="value-prop-desc">Inspected for weave perfection, zari density, and bead strength.</p>
              </div>
              <div className="value-prop-card">
                <HeartHandshake size={24} className="value-prop-icon" />
                <h4 className="value-prop-title">Artisan First</h4>
                <p className="value-prop-desc">We support fair-wages for rural Indian handloom workers.</p>
              </div>
            </div>
          </div>
          <div className="promo-image-container">
            <img 
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" 
              alt="Artisan embroidering" 
              className="promo-img" 
            />
          </div>
        </div>
      </section>

      {/* Boutique Details Map/Contact Card */}
      <section className="boutique-visit-section container reveal-element">
        <div className="glass-panel boutique-visit-grid">
          <div>
            <span className="section-tag" style={{ color: 'var(--secondary)' }}>Namaste & Welcome</span>
            <h2 className="boutique-visit-title">
              Visit Our Kanpur Boutique
            </h2>
            <p className="boutique-visit-text">
              Feel the richness of raw silk and verify the heavy borders of Banarasi sarees in person. 
              We look forward to hosting you at our family boutique on Shivala Road.
            </p>
            <div className="boutique-visit-info">
              <div className="boutique-visit-info-item">
                <MapPin size={20} className="boutique-visit-icon" />
                <span><strong>Boutique Address:</strong> 37/47, Shivala Road, Kanpur, UP - 208001</span>
              </div>
            </div>
          </div>
          <div className="boutique-visit-map-container">
            {/* Display static maps card representing store placement */}
            <iframe 
              title="Google Map Place"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.7455823529324!2d80.347585!3d26.463991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4709af03db25%3A0xc3457193b22b64d3!2sShivala%20Road%2C%20Kanpur%2C%20Uttar%20Pradesh%20208001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
