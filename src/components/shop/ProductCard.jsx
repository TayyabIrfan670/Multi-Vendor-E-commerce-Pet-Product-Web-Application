import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import '../assets/styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="brand">{product.brand}</p>
        <p className="price">PKR {product.price.toLocaleString()}</p>
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < product.rating ? 'star filled' : 'star'}>
              ★
            </span>
          ))}
        </div>
        {product.isNew && <span className="new-badge">New</span>}
      </div>
    </Link>
  );
};

export default ProductCard; 