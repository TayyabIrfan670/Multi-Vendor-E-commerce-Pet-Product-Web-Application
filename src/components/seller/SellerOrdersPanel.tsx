import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Badge, Card, Row, Col, Alert, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Order, orderService } from '../../services/orderService';

interface SellerOrdersPanelProps {
  sellerId: string;
}

const SellerOrdersPanel: React.FC<SellerOrdersPanelProps> = ({ sellerId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchSellerOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching orders for seller ID: "${sellerId}" (Type: ${typeof sellerId})`);
      
      if (!sellerId) {
        console.error('Error: Seller ID is undefined or empty');
        setError('Invalid seller ID. Please try logging in again.');
        setLoading(false);
        return;
      }
      
      const url = `http://localhost:5001/api/orders/seller/${sellerId}`;
      console.log(`Making API request to: ${url}`);
      
      // Debug localStorage state
      console.log('Current seller info in localStorage:', localStorage.getItem('sellerInfo'));
      
      const response = await axios.get(url);
      console.log(`API response received:`, response);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Received ${response.data.length} orders from API`);
        setOrders(response.data);
        setError(null);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received an invalid response from the server');
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data || error.message);
        console.error('Axios error status:', error.response?.status);
        console.error('Axios error headers:', error.response?.headers);
      }
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    console.log("SellerOrdersPanel mounted with sellerId:", sellerId);
    fetchSellerOrders();
  }, [sellerId, fetchSellerOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders list
      await fetchSellerOrders();
      setUpdatingOrderId(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-3">
        <h4>Loading orders...</h4>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-3">
        <Alert variant="info">No orders found for your products</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <h3 className="mb-4">Your Orders</h3>
      
      <Row>
        <Col lg={3} md={6} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h5>Total Orders</h5>
              <h2>{orders.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h5>Pending</h5>
              <h2>{orders.filter(order => order.status === 'pending').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h5>Processing</h5>
              <h2>{orders.filter(order => order.status === 'processing').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h5>Delivered</h5>
              <h2>{orders.filter(order => order.status === 'delivered').length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Your Items</th>
            <th>Your Total</th>
            <th>Order Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.substring(order._id.length - 8)}</td>
              <td>
                <div><strong>{order.customerDetails.fullName}</strong></div>
                <small>{order.customerDetails.phone}</small>
                <div>
                  <small>{order.customerDetails.city}, {order.customerDetails.address}</small>
                </div>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item._id}>
                    {item.name} x {item.quantity} = PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                ))}
              </td>
              <td>
                <strong>PKR {order.sellerTotal ? order.sellerTotal.toLocaleString() : '-'}</strong>
              </td>
              <td>
                <Badge bg={getStatusBadgeVariant(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </td>
              <td>
                {new Date(order.createdAt).toLocaleDateString()}
                <br />
                <small>
                  {new Date(order.createdAt).toLocaleTimeString()}
                </small>
              </td>
              <td>
                <Form.Select
                  size="sm"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value as Order['status'])}
                  disabled={updatingOrderId === order._id}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
                {updatingOrderId === order._id && (
                  <small className="text-muted d-block mt-1">Updating...</small>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SellerOrdersPanel; 