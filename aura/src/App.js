import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import Components
import Navbar from "./Components/LandingPage/Navbar/Navbar";
import Footer from "./Components/LandingPage/Footer/Footer";
import Women from "./Pages/LandingPages/Women";
import FilterPage from "./Pages/FilterPages/FilterPage";
import CategoriesMain from "./Components/LandingPage/CategoriesMain/CategoriesMain";
import Login from "./Pages/AuthPages/Login";
import Signup from "./Pages/AuthPages/Signup";
import AuthPage from "./Pages/AuthPages/AuthPage";
import CartPage from "./Components/LandingPage/CartPage/CartPage";
import PaymentGateway from "./Pages/PaymentGateway/PaymentGateway";
import Card from "./Components/FilterPages/Card";
import ProductDetail from "./Pages/ProductDetail/ProductDetail.js";
import DeleteAccountPage from './Components/Profile/DeleteAccountPage/DeleteAccountPage';

// Import Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";

// Import Private Route
import PrivateRoute from "./Components/privateRoute";
import ProfilePage from "./Pages/ProfilePages/ProfilePage.js";

// Import CORS - Remove usage of CORS in the frontend
// import cors from 'cors'; // Comment this out because it's used server-side, not on the client.

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
            <Route path="/product" element={<CategoriesMain category="product" />}></Route>
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />

            {/* Private Routes (Only accessible when logged in) */}
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <PaymentGateway />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/delete"
              element={
                <PrivateRoute>
                  <DeleteAccountPage />
                </PrivateRoute>
              }
            />

            <Route path="/women" element={<Women />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/" component={Card} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </LoginProvider>
  );
}

export default App;