import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Form } from 'react-bootstrap';
import { orderService, Order } from '../services/orderService';

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
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
      <Container className="py-5">
        <h2>Loading orders...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <h2>Error</h2>
        <p className="text-danger">{error}</p>
        <Button variant="primary" onClick={fetchOrders}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Orders Management</h2>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>
                <strong>{order.customerDetails.fullName}</strong>
                <br />
                <small>{order.customerDetails.email}</small>
                <br />
                <small>{order.customerDetails.phone}</small>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item._id}>
                    {item.name} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>PKR {order.totalAmount.toLocaleString()}</td>
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
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersPanel; 