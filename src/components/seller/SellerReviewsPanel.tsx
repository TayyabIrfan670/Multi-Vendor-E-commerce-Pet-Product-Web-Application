import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Row, Col, Badge, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { getSellerReviews, respondToReview } from '../../services/sellerProducts';
import { isAuthenticated } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import './SellerReviewsPanel.css';

interface Review {
  reviewId: string;
  productId: string;
  productName: string;
  productImage: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
  sellerResponse: {
    text: string | null;
    createdAt: string | null;
  } | null;
}

const SellerReviewsPanel: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const navigate = useNavigate();
  
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get the backend URL for images
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder.jpg';
    
    // If the URL is already absolute (starts with http or https), use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If the URL starts with /api/uploads, prepend the backend URL
    if (imageUrl.startsWith('/api/uploads')) {
      return `http://localhost:5001${imageUrl}`;
    }
    
    // If it's another relative path, return as is
    return imageUrl;
  };
  
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const rawData = await getSellerReviews();
      
      // Transform the raw data to match our Review interface
      const adaptedReviews: Review[] = rawData.map(raw => ({
        reviewId: raw._id,
        productId: raw.productId,
        productName: raw.productName,
        productImage: raw.productImage,
        user: raw.userName || 'Anonymous User',
        rating: raw.rating,
        comment: raw.comment,
        createdAt: raw.createdAt,
        sellerResponse: raw.sellerResponse ? {
          text: raw.sellerResponse,
          createdAt: raw.sellerResponseDate || null
        } : null
      }));
      
      setReviews(adaptedReviews);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/seller-login');
      return;
    }
    
    fetchReviews();
  }, [navigate, fetchReviews, refreshTrigger]);
  
  const handleRespondClick = (review: Review) => {
    setCurrentReview(review);
    setResponseText(review.sellerResponse?.text || '');
    setShowResponseModal(true);
  };
  
  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentReview) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await respondToReview(
        currentReview.productId,
        currentReview.reviewId,
        responseText
      );
      
      setSuccess('Response submitted successfully');
      setShowResponseModal(false);
      
      // Refresh the reviews list
      setRefreshTrigger(prev => prev + 1);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  const handleCloseModal = () => {
    setShowResponseModal(false);
    setCurrentReview(null);
    setResponseText('');
  };
  
  return (
    <Container className="seller-reviews-panel py-4">
      <h2 className="mb-4">Product Reviews</h2>
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : reviews.length === 0 ? (
        <Alert variant="info">
          No reviews found for your products yet.
        </Alert>
      ) : (
        <Row>
          {reviews.map((review) => (
            <Col key={review.reviewId} md={6} lg={6} className="mb-4">
              <Card className="h-100 review-card">
                <Card.Body>
                  <div className="review-header">
                    <div className="d-flex align-items-center mb-3">
                      <div className="product-image-container">
                        <img 
                          src={getImageUrl(review.productImage)} 
                          alt={review.productName}
                          className="product-thumbnail" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ms-3">
                        <h5 className="product-name mb-1">{review.productName}</h5>
                        <div className="d-flex align-items-center">
                          {renderStars(review.rating)}
                          <span className="ms-2 rating-text">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-content mb-3">
                    <div className="review-user-info mb-2">
                      <strong>{review.user}</strong> • {formatDate(review.createdAt)}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                  
                  {review.sellerResponse && (
                    <div className="seller-response mb-3">
                      <Badge bg="primary" className="mb-2">Your Response</Badge>
                      <p className="response-text">
                        {review.sellerResponse.text}
                      </p>
                      <div className="response-date text-muted">
                        {review.sellerResponse.createdAt && formatDate(review.sellerResponse.createdAt)}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-end">
                    <Button 
                      variant={review.sellerResponse ? "outline-primary" : "primary"} 
                      onClick={() => handleRespondClick(review)}
                    >
                      {review.sellerResponse ? "Edit Response" : "Respond"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Response Modal */}
      <Modal show={showResponseModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentReview?.sellerResponse ? "Edit Your Response" : "Respond to Review"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentReview && (
            <>
              <div className="mb-3">
                <h6>Review from {currentReview.user} for {currentReview.productName}</h6>
                <div className="d-flex align-items-center mb-2">
                  {renderStars(currentReview.rating)}
                  <span className="ms-2">{currentReview.rating}/5</span>
                </div>
                <p className="border-bottom pb-3">{currentReview.comment}</p>
              </div>
              
              <Form onSubmit={handleResponseSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response here..."
                    required
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2" 
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                          role="status" 
                          aria-hidden="true" 
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      currentReview.sellerResponse ? "Update Response" : "Submit Response"
                    )}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SellerReviewsPanel; 