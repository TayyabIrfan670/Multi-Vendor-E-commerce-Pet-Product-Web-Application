import React from 'react';
import { Navigate } from 'react-router-dom';
import SellerReviewsPanel from '../components/seller/SellerReviewsPanel';
import { isAuthenticated } from '../services/auth';

const SellerReviewsPage: React.FC = () => {
  // Check if seller is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/seller-login" />;
  }

  return (
    <div className="seller-reviews-page">
      <SellerReviewsPanel />
    </div>
  );
};

export default SellerReviewsPage; 