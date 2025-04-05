import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./assets/styles/buttons.css";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import HomePage from "./components/home/HomePage";
import ProductDetail from "./components/product/ProductDetail";

// Seller Pages
import RegisterSeller from "./components/seller/RegisterSeller";
import SellerLogin from "./components/seller/SellerLogin";
import SellerDashboard from "./components/seller/SellerDashboard";
import ProductManagement from "./components/seller/ProductManagement";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerReviewsPage from "./pages/SellerReviewsPage";

// Context
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/register-seller" element={<RegisterSeller />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route
              path="/seller/product-management"
              element={<ProductManagement />}
            />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/reviews" element={<SellerReviewsPage />} />
            <Route path="/profile" element={<div>Profile - Coming Soon</div>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
