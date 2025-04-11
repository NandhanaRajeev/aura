import "./App.css";
import React from "react";
import Navbar from "./Components/LandingPage/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Women from "./Pages/LandingPages/Women";
import FilterPage from "./Pages/FilterPages/FilterPage.js";
import CategoriesMain from "./Components/LandingPage/CategoriesMain/CategoriesMain";
import Footer from "./Components/LandingPage/Footer/Footer";
import Login from "./Pages/AuthPages/Login";
import Signup from "./Pages/AuthPages/Signup";
import AuthPage from "./Pages/AuthPages/AuthPage";
import CartPage from "./Components/LandingPage/CartPage/CartPage.js";
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext.js";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Women />} />
          <Route path="/latest" element={<CategoriesMain category="latest" />} />
          <Route path="/about" element={<CategoriesMain category="about" />} />
          <Route path="/product" element={<CategoriesMain category="product" />}>
            <Route path=":productId" element={<CategoriesMain category="product" />} />
          </Route>
          <Route path="/filters" element={<FilterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/women" element={<Women />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
