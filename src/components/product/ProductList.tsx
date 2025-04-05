import React, { useContext } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductList.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  rating: number;
  isNew: boolean;
  isSale?: boolean;
  discountPrice?: number;
  countInStock: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };
  
  return (
    <Row>
      {products.length === 0 ? (
        <Col className="text-center py-5">
          <p>No products found. Try adjusting your filters.</p>
        </Col>
      ) : (
        products.map(product => (
          <Col key={product._id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
            <Card className="product-card h-100">
              <div className="product-img-container">
                <Link to={`/product/${product._id}`}>
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                    }}
                  />
                </Link>
                {product.isNew && <span className="badge-new">New</span>}
                {product.isSale && <span className="badge-sale">Sale</span>}
                
                {/* Stock status badge */}
                {product.countInStock <= 0 ? (
                  <span className="badge-stock badge-out-of-stock">Out of Stock</span>
                ) : product.countInStock <= 5 ? (
                  <span className="badge-stock badge-low-stock">Low Stock: {product.countInStock}</span>
                ) : null}
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="product-title">
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </Card.Title>
                
                <div className="product-brand">{product.brand}</div>
                
                <div className="mt-auto">
                  <div className="product-price">
                    {product.isSale && product.discountPrice ? (
                      <>
                        <span className="original-price">${product.price.toFixed(2)}</span>
                        <span className="sale-price">${product.discountPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 w-100"
                    disabled={product.countInStock <= 0}
                  >
                    {product.countInStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );
};

export default ProductList; 