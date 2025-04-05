import React from 'react';
import MainNavbar from './Navbar';
import Footer from './Footer';
import '../../assets/styles/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <MainNavbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 