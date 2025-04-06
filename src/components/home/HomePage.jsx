import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import HeroSection from './HeroSection';
import SplashEffect from '../effects/SplashEffect';
import '../../assets/styles/splash-effect.css';

const HomePage = () => {
  const categories = [
    { id: 'dog', name: 'Dogs', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop' },
    { id: 'cat', name: 'Cats', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop' },
    { id: 'fish', name: 'Fish', image: 'https://images.unsplash.com/photo-1522720833375-9c27ffb02a5e?q=80&w=400&auto=format&fit=crop' },
    { id: 'bird', name: 'Birds', image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=400&auto=format&fit=crop' },
  ];

  const features = [
    { 
      title: 'Free Shipping', 
      description: 'Free shipping on all orders over $50',
      icon: '🚚'
    },
    { 
      title: 'Premium Products', 
      description: 'Quality products for your beloved pets',
      icon: '⭐'
    },
    { 
      title: 'Expert Support', 
      description: 'Get advice from our pet care specialists',
      icon: '👨‍⚕️'
    },
  ];

  return (
    <div className="home-page">
      <HeroSection />
      
      <Container className="py-5">
        <h2 className="text-center mb-4">Shop by Pet</h2>
        <Row>
          {categories.map(category => (
            <Col key={category.id} md={3} sm={6} className="mb-4">
              <SplashEffect>
                <Card className="category-card h-100">
                  <Card.Img 
                    variant="top" 
                    src={category.image} 
                    alt={category.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{category.name}</Card.Title>
                  </Card.Body>
                </Card>
              </SplashEffect>
            </Col>
          ))}
        </Row>
      </Container>
      
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Why Choose Us</h2>
          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={4} className="mb-4">
                <SplashEffect>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <div className="feature-icon mb-3" style={{ fontSize: '3rem' }}>
                        {feature.icon}
                      </div>
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text>{feature.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </SplashEffect>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      
      <Container className="py-5 text-center">
        <SplashEffect>
          <h2 className="mb-4">Join Our Pet Community</h2>
          <p className="lead mb-4">
            Subscribe to our newsletter for pet care tips, exclusive offers, and more!
          </p>
          <div className="newsletter-form mx-auto" style={{ maxWidth: '500px' }}>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email address" 
                aria-label="Your email address"
              />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </SplashEffect>
      </Container>
    </div>
  );
};

export default HomePage; 