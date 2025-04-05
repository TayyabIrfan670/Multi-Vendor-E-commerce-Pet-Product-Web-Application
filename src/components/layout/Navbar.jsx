import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import '../../assets/styles/navbar.css';

const MainNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { items, getTotal } = useCart();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to shop page with search query parameter
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="pet-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">PetVerse</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/vets-portal">Vets Portal</Nav.Link>
            <Nav.Link as={Link} to="/connect">Connect</Nav.Link>
            <Nav.Link as={Link} to="/register-seller">Register as Seller</Nav.Link>
          </Nav>
          <Form className="d-flex mx-auto" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
          </Form>
          <Nav>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              <FaShoppingCart />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Nav.Link>
            {itemCount > 0 && (
              <div className="cart-total">
                PKR {getTotal().toLocaleString()}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar; 