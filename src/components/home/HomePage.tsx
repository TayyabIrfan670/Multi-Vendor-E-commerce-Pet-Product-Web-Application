import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HomeCarousel from './HomeCarousel';
import '../../assets/styles/home-page.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Container>
        <HomeCarousel />
        
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
      </Container>
    </div>
  );
};

export default HomePage;
