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
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import DeleteAccountPage from "./Components/Profile/DeleteAccountPage/DeleteAccountPage";
import SupportPage from "./Components/Profile/SupportPage/SupportPage";
import HelpCenterPage from "./Components/Profile/HelpCenterPage/HelpCenterPage";
import AuraStories from "./Components/LandingPage/Footer/AuraStories";
import AddToWishlist from "./Components/LandingPage/Wishlist/AddToWishlist";
import AboutUs from "./Components/LandingPage/AboutUs/AboutUs";
import TermsOfUse from "./Components/LandingPage/Footer/TermsOfUse";
import Privacy from "./Components/LandingPage/AboutUs/Privacy/Privacy";


// Import Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";
import { WishlistProvider } from "./Components/LandingPage/Wishlist/WishlistContext";

// Import Private Route
import PrivateRoute from "./Components/privateRoute";
import ProfilePage from "./Pages/ProfilePages/ProfilePage";

function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Women />} />
              <Route path="/latest" element={<CategoriesMain category="latest" />} />
              <Route path="/product" element={<CategoriesMain category="product" />} />
              <Route path="/filters" element={<FilterPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="/profile/*" element={<ProfilePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/helpcenter" element={<HelpCenterPage />} />
              <Route path="/aurastories" element={<AuraStories />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<Privacy />} />

              <Route path="/wishlist" element={<AddToWishlist />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/women" element={<Women />} />

              {/* Private Routes */}
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
            </Routes>
            <Footer />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </LoginProvider>
  );
}

export default App;
