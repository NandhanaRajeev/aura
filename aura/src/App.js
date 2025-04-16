import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Women from "./Pages/LandingPages/Women";
import FilterPage from "./Pages/FilterPages/FilterPage";
import CategoriesMain from "./Components/LandingPage/CategoriesMain/CategoriesMain";
import Login from "./Pages/AuthPages/Login";
import Signup from "./Pages/AuthPages/Signup";
import AuthPage from "./Pages/AuthPages/AuthPage";
import CartPage from "./Components/LandingPage/CartPage/CartPage";

// Components
import Navbar from "./Components/LandingPage/Navbar/Navbar";
import Footer from "./Components/LandingPage/Footer/Footer";

// Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";

function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Women />} />
            <Route path="/latest" element={<CategoriesMain category="latest" />} />
            <Route path="/about" element={<CategoriesMain category="about" />} />
            <Route path="/product" element={<CategoriesMain category="product" />} />
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/women" element={<Women />} />

            {/* Product Details Route */}
            <Route path="/product/:id" element={<ProductDetail/>} />

            {/* Cart and payment - Uncomment when PrivateRoute is ready */}
            {/* <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} /> */}
            {/* <Route path="/payment" element={<PrivateRoute><PaymentGateway /></PrivateRoute>} /> */}
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </LoginProvider>
  );
}

export default App;
