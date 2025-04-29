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
import HelpCenterPage from "./Components/Profile/HelpCenterPage/HelpCenterPage"; // ✅ NEW IMPORT
<<<<<<< Updated upstream
import AuraStories from "./Components/LandingPage/Footer/AuraStories";
import AddToWishlist from "./Components/LandingPage/Wishlist/AddToWishlist"; // Import the Wishlist component
=======
import AboutUs from "./Components/LandingPage/AboutUs/AboutUs";


>>>>>>> Stashed changes
// Import Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";
import { WishlistProvider } from "./Components/LandingPage/Wishlist/WishlistContext"; // Add this import

// Import Private Route
import PrivateRoute from "./Components/privateRoute";
import ProfilePage from "./Pages/ProfilePages/ProfilePage";

function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <WishlistProvider> {/* Add WishlistProvider here */}
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
              <Route path="/profile/*" element={<ProfilePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/helpcenter" element={<HelpCenterPage />} /> {/* ✅ ADDED ROUTE */}
              <Route path="/aurastories" element={<AuraStories />} /> {/* New Route */}
              <Route path="/wishlist" element={<AddToWishlist />} />

<<<<<<< Updated upstream
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
=======
            {/* Public Routes */}
            <Route path="/" element={<Women />} />
            <Route path="/latest" element={<CategoriesMain category="latest" />} />
            <Route path="/about" element={<AboutUs />} /> {/* Added AboutUs route */}
            <Route path="/product" element={<CategoriesMain category="product" />} />
            <Route path="/filters" element={<FilterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/helpcenter" element={<HelpCenterPage />} /> {/* ✅ ADDED ROUTE */}
>>>>>>> Stashed changes

              <Route path="/women" element={<Women />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Remove this if unnecessary */}
              {/* <Route path="/" component={Card} /> */}
            </Routes>
            <Footer />
          </BrowserRouter>
        </WishlistProvider> {/* Close WishlistProvider */}
      </CartProvider>
    </LoginProvider>
  );
}

export default App;
