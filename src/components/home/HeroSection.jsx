import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Pet Paradise</h1>
        <p>Discover everything your pet needs in one place</p>
        <div className="hero-buttons">
          <Link to="/shop" className="shop-now-btn">
            Shop Now
          </Link>
          <Link to="/about" className="learn-more-btn">
            Learn More
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-pet.jpg" alt="Happy Pet" />
      </div>
    </div>
  );
};

export default HeroSection; 