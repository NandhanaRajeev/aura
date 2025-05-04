// src/Pages/ProfilePages/ProfilePage.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../Components/Profile/SidebarProf/SidebarProf';
import ProfileDetail from '../../Components/Profile/ProfileDetails/ProfileDetail';
import ProfileForm from '../../Components/Profile/ProfileForm/ProfileForm';
import CouponPage from '../../Components/Profile/CouponPage/CouponPage';
import SavedUPIPage from '../../Components/Profile/SavedUPIPage/SavedUPIPage';
import SupportPage from '../../Components/Profile/SupportPage/SupportPage';
import SavedaddressPage from '../../Components/Profile/SavedaddressPage/SavedaddressPage';
import OrdersPage from '../../Components/Profile/OrdersPage/OrdersPage';
import DeleteAccountPage from '../../Components/Profile/DeleteAccountPage/DeleteAccountPage';
import HelpCenterPage from '../../Components/Profile/HelpCenterPage/HelpCenterPage';
import FeedbackForm from '../../Components/Profile/FeedbackForm/FeedbackForm';
import AddressForm from '../../Components/Profile/AddressForm/AddressForm';
import './ProfilePage.css'; // Import the CSS

const ProfilePage = () => {
  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-content">
        <Routes>
          <Route index element={<ProfileDetail />} /> {/* Default Profile Page */}
          <Route path="profile-form" element={<ProfileForm />} />
          <Route path="coupons" element={<CouponPage />} />
          <Route path="saved-upi" element={<SavedUPIPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="saved-address" element={<SavedaddressPage />} />
          <Route path="orders/:user_id" element={<OrdersPage />} />
          <Route path="delete-account" element={<DeleteAccountPage />} />
          <Route path="help-center" element={<HelpCenterPage />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="address-form" element={<AddressForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProfilePage;