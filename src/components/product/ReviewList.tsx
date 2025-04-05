import React from 'react';
import { Card } from 'react-bootstrap';
import './ReviewList.css';

interface Review {
  _id?: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  sellerResponse?: {
    text: string | null;
    createdAt: Date | string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-list">
      <h3 className="reviews-title mb-4">Customer Reviews</h3>
      
      {reviews.map((review, index) => (
        <Card key={review._id || index} className="mb-3 review-card">
          <Card.Body>
            <div className="review-header">
              <div className="review-user-info">
                <h5 className="mb-0">{review.user}</h5>
                <div className="review-date">
                  {formatDate(review.createdAt)}
                </div>
              </div>
              
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`review-star ${i < review.rating ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="review-comment mt-3">
              {review.comment}
            </div>
            
            {review.sellerResponse && review.sellerResponse.text && (
              <div className="seller-response mt-3">
                <div className="seller-response-title">Seller Response</div>
                <div className="seller-response-text">{review.sellerResponse.text}</div>
                {review.sellerResponse.createdAt && (
                  <div className="seller-response-date">
                    {formatDate(review.sellerResponse.createdAt)}
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList; 