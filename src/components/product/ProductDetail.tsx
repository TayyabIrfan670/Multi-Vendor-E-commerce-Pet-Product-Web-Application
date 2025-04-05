import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { fetchProductById } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './ProductDetail.css';

interface Review {
  _id?: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  category: string;
  rating: number;
  reviews: Review[];
  numReviews: number;
  isNew: boolean;
  countInStock: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cartContext = useContext(CartContext);
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(id || '');
        
        // Adapt the mock product data to match our Product interface
        const adaptedProduct: Product = {
          _id: productData._id,
          name: productData.name,
          price: productData.price,
          description: productData.description,
          image: productData.image,
          brand: productData.brand || 'Unknown Brand',
          category: productData.category || 'Uncategorized',
          rating: productData.averageRating || 0,
          // Transform reviews to match the expected Review interface
          reviews: productData.reviews?.map(review => ({
            _id: review._id,
            user: review.userName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          })) || [],
          numReviews: productData.reviews?.length || 0,
          isNew: new Date(productData.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000, // Created in last 30 days
          countInStock: productData.countInStock || productData.stock || 0
        };
        
        setProduct(adaptedProduct);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      cartContext.addToCart(product, quantity);
      // Reset quantity after adding to cart
      setQuantity(1);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  
  const handleReviewAdded = async () => {
    // Reload product to get updated reviews
    if (id) {
      try {
        const updatedProductData = await fetchProductById(id);
        
        // Adapt the mock product data to match our Product interface
        const adaptedProduct: Product = {
          _id: updatedProductData._id,
          name: updatedProductData.name,
          price: updatedProductData.price,
          description: updatedProductData.description,
          image: updatedProductData.image,
          brand: updatedProductData.brand || 'Unknown Brand',
          category: updatedProductData.category || 'Uncategorized',
          rating: updatedProductData.averageRating || 0,
          // Transform reviews to match the expected Review interface
          reviews: updatedProductData.reviews?.map(review => ({
            _id: review._id,
            user: review.userName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          })) || [],
          numReviews: updatedProductData.reviews?.length || 0,
          isNew: new Date(updatedProductData.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
          countInStock: updatedProductData.countInStock || updatedProductData.stock || 0
        };
        
        setProduct(adaptedProduct);
      } catch (err) {
        console.error('Failed to reload product after review:', err);
      }
    }
  };
  
  // Function to ensure image URL is valid
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
  
  const renderStockStatus = () => {
    if (!product) return null;
    
    if (product.countInStock <= 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (product.countInStock <= 5) {
      return <Badge bg="warning">Low Stock: {product.countInStock} left</Badge>;
    } else {
      return <Badge bg="success">In Stock: {product.countInStock} available</Badge>;
    }
  };
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="product-rating mb-3">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`product-star ${i < Math.round(rating) ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="product-rating-text ms-2">
          {rating.toFixed(1)} ({product?.numReviews || 0} reviews)
        </span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
  
  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Product not found</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-5 product-detail">
      <Row>
        <Col md={6} className="mb-4">
          <div className="product-image">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="img-fluid rounded" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
                console.log('Image failed to load:', product.image);
              }}
            />
            {product.isNew && <span className="badge-new">New</span>}
          </div>
        </Col>
        
        <Col md={6}>
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="product-brand">By {product.brand}</span>
              <span className="product-category">Category: {product.category}</span>
            </div>
            
            {renderRatingStars(product.rating)}
            
            <div className="product-price mb-3">
              PKR {product.price.toFixed(2)}
            </div>
            
            <div className="stock-status mb-3">
              {renderStockStatus()}
            </div>
            
            <div className="product-description mb-4">
              <h5>Description</h5>
              <p>{product.description}</p>
            </div>
            
            {product.countInStock > 0 ? (
              <div className="d-flex flex-wrap gap-2 mb-4">
                <div className="quantity-select">
                  <label htmlFor="quantity" className="me-2">Quantity:</label>
                  <select 
                    id="quantity" 
                    className="form-select" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                  >
                    {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={handleAddToCart}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </Button>
              </div>
            ) : (
              <Button 
                variant="secondary" 
                disabled
                className="mb-4"
              >
                Out of Stock
              </Button>
            )}
            
            <div className="back-link">
              <Link to="/shop">← Back to Shop</Link>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col xs={12}>
          <Tabs 
            defaultActiveKey="reviews" 
            className="mb-4 product-tabs"
          >
            <Tab eventKey="reviews" title="Reviews">
              <ReviewList reviews={product.reviews || []} />
              <ReviewForm 
                productId={product._id} 
                onReviewAdded={handleReviewAdded} 
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail; 