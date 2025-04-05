import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../context/CartContext';
import '../../assets/styles/product-card.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };
  
  // Function to ensure image URL is valid
  const getImageUrl = (imageUrl: string) => {
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

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <Card className="h-100">
        <div className="product-image">
          <Card.Img 
            variant="top" 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.jpg';
              console.log('Image failed to load:', product.image);
            }}
          />
          <Button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            variant="primary"
            disabled={product.countInStock <= 0}
          >
            {product.countInStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="brand">{product.brand}</Card.Text>
          <Card.Text className="price">PKR {product.price.toLocaleString()}</Card.Text>
          <div className="rating">
            {[...Array(5)].map((_, index) => (
              <span key={index} className={index < (product.rating || 0) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
          </div>
          {product.isNew && <Badge bg="success">New</Badge>}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard; 