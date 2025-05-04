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
import ChatbotPage from './Components/LandingPage/Chatbot/Chatbot'; // Import the ChatbotPage component



// Import Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";
import { WishlistProvider } from "./Components/LandingPage/Wishlist/WishlistContext";

// Import Private Route
import PrivateRoute from "./Components/privateRoute";
import ProfilePage from "./Pages/ProfilePages/ProfilePage";


// Import CORS - Remove usage of CORS in the frontend
// import cors from 'cors'; // Comment this out because it's used server-side, not on the client.

// Import CORS - Remove usage of CORS in the frontend
// import cors from 'cors'; // Comment this out because it's used server-side, not on the client.

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
              <Route path="/chatbot" element={<ChatbotPage />} /> {/* Define the new route */}


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
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Women />} />
            <Route path="/latest" element={<CategoriesMain category="latest" />} />
            <Route path="/about" element={<CategoriesMain category="about" />} />
            <Route path="/product" element={<CategoriesMain category="product" />}></Route>
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

// app.js