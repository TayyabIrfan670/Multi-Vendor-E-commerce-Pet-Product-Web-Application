import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HomeCarousel from './HomeCarousel';
import ProductList from '../shop/ProductList';
import { fetchProducts } from '../../services/api';
import { Product } from '../../context/CartContext';
import '../../assets/styles/home-page.css';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Fetch featured products
        const featuredResponse = await fetchProducts({ sortBy: 'rating', limit: 4 });
        setFeaturedProducts(featuredResponse);

        // Fetch new arrivals
        const newArrivalsResponse = await fetchProducts({ sortBy: 'newest', limit: 4 });
        setNewArrivals(newArrivalsResponse);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  return (
    <div className="home-page">
      <Container>
        <HomeCarousel />
        
        <section className="featured-products">
          <ProductList title="Featured Products" products={featuredProducts} />
        </section>
        
        <section className="categories-section">
          <h2 className="section-title">Shop by Pet</h2>
          <Row className="category-cards">
            <Col md={4} className="mb-4">
              <div className="category-card dog-category">
                <div className="category-overlay">
                  <h3>Dogs</h3>
                  <a href="/shop?pet=dog" className="category-link">Shop Now</a>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="category-card cat-category">
                <div className="category-overlay">
                  <h3>Cats</h3>
                  <a href="/shop?pet=cat" className="category-link">Shop Now</a>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="category-card other-category">
                <div className="category-overlay">
                  <h3>Other Pets</h3>
                  <a href="/shop?pet=other" className="category-link">Shop Now</a>
                </div>
              </div>
            </Col>
          </Row>
        </section>
        
        <section className="new-arrivals">
          <ProductList title="New Arrivals" products={newArrivals} />
        </section>
      </Container>
    </div>
  );
};

export default HomePage; 