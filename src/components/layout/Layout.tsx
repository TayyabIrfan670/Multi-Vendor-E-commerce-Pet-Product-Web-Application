import React from 'react';
import MainNavbar from './Navbar';
import { Container } from 'react-bootstrap';
import '../../assets/styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <MainNavbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <Container>
          <div className="footer-content">
            <div className="footer-section">
              <h5>PetVerse</h5>
              <p>Your one-stop shop for all pet needs.</p>
            </div>
            <div className="footer-section">
              <h5>Quick Links</h5>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/vets-portal">Vets Portal</a></li>
                <li><a href="/connect">Connect</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Customer Service</h5>
              <ul className="footer-links">
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/shipping">Shipping Policy</a></li>
                <li><a href="/returns">Returns & Refunds</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Connect With Us</h5>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">Pinterest</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PetVerse. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout; 