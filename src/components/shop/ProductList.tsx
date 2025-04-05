import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { Product } from '../../context/CartContext';
import '../../assets/styles/product-list.css';

interface ProductListProps {
  title?: string;
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ 
  title = 'Featured Products',
  products 
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-list-container">
        <h2 className="section-title">{title}</h2>
        <div className="text-center py-5">
          <p>No products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="section-title">{title}</h2>
      <Row>
        {products.map(product => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList; 