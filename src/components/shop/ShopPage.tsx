import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ProductList from './ProductList';
import PriceFilter from './PriceFilter';
import { fetchProducts } from '../../services/api';
import { Product } from '../../context/CartContext';
import { useSearchParams } from 'react-router-dom';
import '../../assets/styles/shop-page.css';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const search = searchParams.get('search');
        // Create params object, only including non-empty values
        const params: any = {};
        
        if (search) params.search = search;
        if (sortBy) params.sortBy = sortBy;
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 10000) params.maxPrice = priceRange[1];
        
        const response = await fetchProducts(params);
        setProducts(response);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams, sortBy, priceRange]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Loading products...</h2>
          <p>Please wait while we fetch the latest products.</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center text-danger">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={3}>
          <div className="filters-section">
            <PriceFilter
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
            <Form.Group className="mb-3">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
        <Col md={9}>
          <div className="products-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>All Products</h2>
              <p className="mb-0">{products.length} products found</p>
            </div>
            <ProductList products={products} title="" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ShopPage; 