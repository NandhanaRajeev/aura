// src/App.js
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/LandingPage/Navbar/Navbar";
import Footer from "./Components/LandingPage/Footer/Footer";
import Women from "./Pages/LandingPages/Women";
import FilterPage from "./Pages/FilterPages/FilterPage.js";
import CategoriesMain from "./Components/LandingPage/CategoriesMain/CategoriesMain";
import Login from "./Pages/AuthPages/Login";
import Signup from "./Pages/AuthPages/Signup";
import AuthPage from "./Pages/AuthPages/AuthPage";
import CartPage from "./Components/LandingPage/CartPage/CartPage.js";
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext.js";
import PrivateRoute from "./Components/privateRoute.js";
import { LoginProvider } from "./Components/LoginContext.js"; 

function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Women />} />
            <Route path="/latest" element={<CategoriesMain category="latest" />} />
            <Route path="/about" element={<CategoriesMain category="about" />} />
            <Route path="/product" element={<CategoriesMain category="product" />}>
              <Route path=":productId" element={<CategoriesMain category="product" />} />
            </Route>
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/*" element={<AuthPage />} />

            {/* Protected */}
            <Route path="/cart" element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            } />
            <Route path="/women" element={
              <PrivateRoute>
                <Women />
              </PrivateRoute>
            } />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </LoginProvider>
  );
}

export default App;
