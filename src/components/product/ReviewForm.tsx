import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { addProductReview } from '../../services/api';
import './ReviewForm.css';

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim() || !userName.trim()) {
      setError('Please provide your name, rating, and comment');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await addProductReview(productId, {
        rating,
        comment,
        user: userName,
      });
      
      setSuccess(true);
      setComment('');
      setRating(5);
      setUserName('');
      onReviewAdded();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container mt-4 mb-5">
      <h3>Write a Review</h3>
      
      {success && (
        <Alert variant="success">
          Your review has been submitted successfully!
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Your Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            disabled={loading}
            required
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
          className="submit-review-btn"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm; 