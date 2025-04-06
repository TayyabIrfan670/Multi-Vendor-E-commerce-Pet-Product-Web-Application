import React from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import '../assets/styles/cart-page.css';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here!</p>
      </div>
    );
  }

  return (
    <Container className="cart-page py-5">
      <h1 className="mb-4">Your Shopping Cart</h1>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="brand">{item.brand}</p>
              <p className="price">PKR {item.price.toLocaleString()}</p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  <FaMinus />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="remove-btn"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/shop" className="btn btn-outline-secondary">
          Continue Shopping
        </Link>
      </div>
      
      <Col lg={4} className="mt-4 mt-lg-0">
        <Card className="cart-summary">
          <Card.Header>
            <h4>Order Summary</h4>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Items:</span>
              <span>{items.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Amount:</span>
              <span>PKR {getTotal().toLocaleString()}</span>
            </div>
            <hr />
            <Button variant="primary" className="w-100">
              Proceed to Checkout
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
};

export default CartPage; 