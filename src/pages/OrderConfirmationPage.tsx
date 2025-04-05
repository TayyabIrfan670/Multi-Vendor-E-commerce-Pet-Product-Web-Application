import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { FaCheckCircle, FaHome, FaTruck } from 'react-icons/fa';
import { orderService, Order } from '../services/orderService';
import '../assets/styles/order-confirmation.css';

// Import icons as modules instead
import * as FaIcons from 'react-icons/fa';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing');
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your order confirmation...</p>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Order not found'}
        </Alert>
        <Button href="/" variant="primary">
          Return to Home
        </Button>
      </Container>
    );
  }

  // Create icon elements using functions to avoid TypeScript errors
  const CheckCircleIcon = () => <span role="img" aria-label="Check Circle">✅</span>;
  const TruckIcon = () => <span role="img" aria-label="Truck">🚚</span>;
  const HomeIcon = () => <span role="img" aria-label="Home">🏠</span>;

  return (
    <Container className="order-confirmation-page py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="confirmation-card">
            <Card.Body className="text-center">
              <div className="confirmation-icon">
                <CheckCircleIcon />
              </div>
              <h2>Order Confirmed!</h2>
              <p className="confirmation-message">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              
              <div className="order-details">
                <h4>Order Details</h4>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className="status-badge">{order.status}</span></p>
                <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
              </div>
              
              <div className="order-items mt-4">
                <h4>Order Items</h4>
                <div className="items-container">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                      <div className="item-price">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="shipping-info mt-4">
                <h4><TruckIcon /> Shipping Information</h4>
                <p>{order.customerDetails.fullName}</p>
                <p>{order.customerDetails.addressLine1}</p>
                {order.customerDetails.addressLine2 && <p>{order.customerDetails.addressLine2}</p>}
                <p>{order.customerDetails.city}, {order.customerDetails.state} {order.customerDetails.zipCode}</p>
                <p>{order.customerDetails.country}</p>
              </div>
              
              <div className="action-buttons mt-4">
                <Button href="/shop" variant="primary" className="me-3">
                  Continue Shopping
                </Button>
                <Button href="/" variant="outline-primary">
                  <HomeIcon /> Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmationPage; 