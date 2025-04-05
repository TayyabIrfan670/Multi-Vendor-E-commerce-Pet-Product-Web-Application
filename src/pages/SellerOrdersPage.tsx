import React, { useEffect } from 'react';
import { Container, Breadcrumb, Alert } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import SellerOrdersPanel from '../components/seller/SellerOrdersPanel';
import { isAuthenticated, getSellerInfo } from '../services/auth';

const SellerOrdersPage: React.FC = () => {
  console.log("SellerOrdersPage component rendering");
  
  // Check if seller is authenticated
  const authenticated = isAuthenticated();
  console.log("Is seller authenticated:", authenticated);
  
  if (!authenticated) {
    console.log("Seller not authenticated, redirecting to login");
    return <Navigate to="/seller-login" replace />;
  }

  const sellerInfo = getSellerInfo();
  console.log("Seller info retrieved:", JSON.stringify(sellerInfo));
  
  if (!sellerInfo || !sellerInfo._id) {
    console.log("No seller ID found, seller info:", sellerInfo);
    return <Navigate to="/seller-login" replace />;
  }

  console.log("Rendering SellerOrdersPanel with seller ID:", sellerInfo._id);

  return (
    <Container className="py-4">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item as={Link} to="/seller/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Orders</Breadcrumb.Item>
      </Breadcrumb>

      {sellerInfo._id ? (
        <SellerOrdersPanel sellerId={sellerInfo._id} />
      ) : (
        <Alert variant="danger">Error: Unable to load seller information correctly.</Alert>
      )}
    </Container>
  );
};

export default SellerOrdersPage; 