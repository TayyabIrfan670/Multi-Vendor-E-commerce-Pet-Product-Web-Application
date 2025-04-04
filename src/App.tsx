import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./assets/styles/buttons.css";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import HomePage from "./components/home/HomePage";

// Seller Pages
import RegisterSeller from "./components/seller/RegisterSeller";
import SellerLogin from "./components/seller/SellerLogin";

// Context

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/register-seller" element={<RegisterSeller />} />
            <Route path="/seller-login" element={<SellerLogin />} />

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;
