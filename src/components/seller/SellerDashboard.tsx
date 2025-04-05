import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getSellerInfo, logoutSeller } from '../../services/auth';
import { orderService } from '../../services/orderService';
import { getSellerProducts } from '../../services/sellerProducts';
import '../../assets/styles/seller-dashboard.css';

const SellerDashboard: React.FC = () => {
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if seller is authenticated
    if (!isAuthenticated()) {
      navigate('/seller-login');
      return;
    }
    
    // Get seller info from localStorage
    const info = getSellerInfo();
    setSellerInfo(info);
    
    // Fetch data for dashboard
    const fetchDashboardData = async () => {
      if (info && info._id) {
        try {
          // Fetch orders
          const orders = await orderService.getSellerOrders(info._id);
          setOrderCount(orders.length);
          
          // Calculate total revenue from delivered orders
          const revenue = orders
            .filter(order => order.status === 'delivered')
            .reduce((total, order) => total + (order.sellerTotal || 0), 0);
          
          setTotalRevenue(revenue);
          
          // Fetch products
          try {
            const products = await getSellerProducts();
            setProductCount(products.length);
            console.log('Fetched products count:', products.length);
          } catch (productError) {
            console.error('Error fetching product count:', productError);
          }
          
        } catch (error) {
          console.error('Error fetching order stats:', error);
        }
      }
      setLoading(false);
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  const handleLogout = () => {
    logoutSeller();
    navigate('/seller-login');
  };
  
  const handleManageProducts = () => {
    navigate('/seller/product-management');
  };
  
  const handleViewOrders = () => {
    navigate('/seller/orders');
  };
  
  const handleViewReviews = () => {
    navigate('/seller/reviews');
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Loading dashboard...</Alert>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  if (!sellerInfo) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Unable to load seller information. Please log in again.</Alert>
        <Button variant="primary" onClick={() => navigate('/seller-login')}>Go to Login</Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 seller-dashboard">
      <Row className="mb-4">
        <Col>
          <div className="dashboard-header d-flex justify-content-between align-items-center">
            <h2>Seller Dashboard</h2>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="seller-profile">
            <Card.Body>
              <Card.Title>Shop Profile</Card.Title>
              <div className="profile-details">
                <p><strong>Shop Name:</strong> {sellerInfo.shopName}</p>
                <p><strong>Seller Name:</strong> {sellerInfo.name}</p>
                <p><strong>Email:</strong> {sellerInfo.email}</p>
              </div>
              <Button variant="primary" size="sm">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Products</Card.Title>
              <Card.Text className="stats">{productCount}</Card.Text>
              <Button variant="primary" size="sm" onClick={handleManageProducts}>Manage Products</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              <Card.Text className="stats">{orderCount}</Card.Text>
              <Button variant="primary" size="sm" onClick={handleViewOrders}>View Orders</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Revenue</Card.Title>
              <Card.Text className="stats">PKR {totalRevenue.toLocaleString()}</Card.Text>
              <Button variant="primary" size="sm" onClick={handleViewOrders}>View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Reviews</Card.Title>
              <Card.Text>Manage customer reviews and respond to feedback</Card.Text>
              <Button variant="primary" size="sm" onClick={handleViewReviews}>Manage Reviews</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <div className="activity-list">
                {orderCount > 0 ? (
                  <Alert variant="success">
                    You have {orderCount} new order(s)! Check your orders page to process them.
                  </Alert>
                ) : (
                  <Alert variant="info">
                    Welcome to your seller dashboard! This is where you'll manage your products, orders, and store settings.
                  </Alert>
                )}
                <p className="text-center">
                  {orderCount > 0 ? 'Manage your orders to fulfill customer requests.' : 'No recent activity to display.'}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SellerDashboard; 