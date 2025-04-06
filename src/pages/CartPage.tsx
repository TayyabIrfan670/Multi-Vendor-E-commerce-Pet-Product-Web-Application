import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useCart, CartItem } from '../context/CartContext';
import OrderForm, { OrderData } from '../components/order/OrderForm';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/cart-page.css';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: string) => {
    updateQuantity(id, parseInt(quantity));
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleProceedToOrder = () => {
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    try {
      setIsProcessingOrder(true);
      const totalAmount = getCartTotal();
      const order = await orderService.createOrder(orderData, cartItems, totalAmount);
      
      // Clear the cart after successful order
      clearCart();
      
      // Show success message and redirect to order confirmation
      alert('Order placed successfully!');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
      setShowOrderForm(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Shopping Cart</h2>
      <Row>
        <Col lg={8}>
          {cartItems.map((item: CartItem) => (
            <Card key={item._id} className="cart-item mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs={3}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid"
                    />
                  </Col>
                  <Col xs={9}>
                    <h5>{item.name}</h5>
                    <p className="text-muted">{item.brand}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          className="w-50 me-2"
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="text-end">
                        <p className="mb-0">PKR {item.price.toLocaleString()}</p>
                        <small className="text-muted">
                          Total: PKR {(item.price * item.quantity).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Items:</span>
                <span>{cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total Amount:</span>
                <span>PKR {getCartTotal().toLocaleString()}</span>
              </div>
              <Button
                variant="primary"
                className="w-100 mb-2"
                onClick={handleProceedToOrder}
              >
                Proceed to Order
              </Button>
              <Button
                variant="outline-danger"
                className="w-100"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showOrderForm}
        onHide={() => setShowOrderForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderForm
            onSubmit={handleOrderSubmit}
            isLoading={isProcessingOrder}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CartPage; 