import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService';
import '../assets/styles/payment-page.css';

interface PaymentPageState {
  order?: any;
  customerEmail?: string;
}

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const state = location.state as PaymentPageState;
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // If order is passed in navigation state, use it
        if (state?.order) {
          setOrder(state.order);
        } else if (orderId) {
          // Otherwise fetch the order from the API
          const fetchedOrder = await orderService.getOrderById(orderId);
          setOrder(fetchedOrder);
        } else {
          throw new Error('No order information provided');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, state]);
  
  const handleCashOnDelivery = async () => {
    try {
      // Update order to COD and redirect to confirmation
      await orderService.updateOrderStatus(order._id, 'processing');
      navigate(`/orders/${order._id}`, { 
        state: { 
          paymentSuccess: true,
          paymentMethod: 'cod'
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process Cash on Delivery option');
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }
  
  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Failed to load payment information'}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 payment-page">
      <h2 className="mb-4">Complete Your Payment</h2>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h4>Payment Method</h4>
              
              <div className="cod-payment">
                <h4>Cash on Delivery</h4>
                <p>Your order will be delivered to your address and you can pay when you receive it.</p>
                <Button 
                  variant="primary" 
                  onClick={handleCashOnDelivery}
                  className="w-100"
                >
                  Confirm Cash on Delivery
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h4>Order Summary</h4>
              <div className="order-summary">
                <div className="d-flex justify-content-between mb-2">
                  <span>Order ID:</span>
                  <span className="text-muted">{order._id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items:</span>
                  <span>{order.items.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 total-amount">
                  <span>Total Amount:</span>
                  <span>PKR {order.totalAmount.toLocaleString()}</span>
                </div>
                
                <hr />
                
                <h5 className="mb-3">Shipping Details</h5>
                <p className="mb-1"><strong>Name:</strong> {order.customerDetails.fullName}</p>
                <p className="mb-1"><strong>Address:</strong> {order.customerDetails.address}</p>
                <p className="mb-1"><strong>City:</strong> {order.customerDetails.city}, {order.customerDetails.postalCode}</p>
                <p className="mb-1"><strong>Phone:</strong> {order.customerDetails.phone}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage; 