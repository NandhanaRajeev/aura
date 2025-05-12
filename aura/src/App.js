import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Import Components
import Navbar from "./Components/LandingPage/Navbar/Navbar"; // Regular Navbar
import Footer from "./Components/LandingPage/Footer/Footer"; // Regular Footer
import AdminLayout from "./Components/Admin/AdminLayout"; // Admin Layout

// Import Pages
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
import ChatbotPage from './Components/LandingPage/Chatbot/Chatbot'; 
import Admin from "./Components/Admin/landingpage";
import AdminCartPage from "./Components/Admin/AdminCartPage"; // Import the Admin Cart Page
import AdminUsersPage from "./Components/Admin/AdminUsersPage"; // Import the Admin Users Page
import AdminProducts from "./Components/Admin/AdminProductsPage"; /// Import the Admin Products Page
import AdminFeedback from "./Components/Admin/AdminFeedbackPage"; // Import the Admin Feedback Page
import AdminWishlist from "./Components/Admin/AdminWishlistPage"; // Import the Admin Wishlist Page

// Import Contexts
import { CartProvider } from "./Components/LandingPage/CartPage/CartContext";
import { LoginProvider } from "./Components/LoginContext";
import { WishlistProvider } from "./Components/LandingPage/Wishlist/WishlistContext";

// Import Private Route
import PrivateRoute from "./Components/privateRoute";
import ProfilePage from "./Pages/ProfilePages/ProfilePage";
import AdminDashboard from "./Components/Admin/AdminDashboard"; // Import your dashboard


// Conditional rendering of navbar and footer based on route
function App() {
  return (
    <LoginProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <NavbarWithLocation /> {/* Conditionally render Navbar */}
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
              <Route path="/chatbot" element={<ChatbotPage />} />

              {/* Admin Routes */}

<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} /> {/* 👈 This renders for /admin */}
  <Route path="landing" element={<Admin />} />
  <Route path="cart" element={<AdminCartPage />} />
  <Route path="users" element={<AdminUsersPage />} />
  <Route path="feedback" element={<AdminFeedback />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="wishlist" element={<AdminWishlist />} />
</Route>


              {/* Private Routes */}
              <Route
                path="/cart"
                element={<PrivateRoute><CartPage /></PrivateRoute>}
              />
              <Route
                path="/payment"
                element={<PrivateRoute><PaymentGateway /></PrivateRoute>}
              />
              <Route
                path="/profile/delete"
                element={<PrivateRoute><DeleteAccountPage /></PrivateRoute>}
              />
            </Routes>

            {/* Conditional Footer */}
            <FooterWithLocation />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </LoginProvider>
  );
}

// This component checks if we are on an admin route and conditionally renders the Navbar
function NavbarWithLocation() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? null : <Navbar />; // No need to render Navbar for admin routes
}

// This is the component where we use useLocation() inside Router context
function FooterWithLocation() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? null : <Footer />; // No need to render Footer for admin routes
}

export default App;
