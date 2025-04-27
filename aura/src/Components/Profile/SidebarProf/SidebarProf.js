import React from 'react';
import { NavLink } from 'react-router-dom';
import './SidebarProf.css';

const SidebarProf = () => {
  return (
    <div className="flex-container">
      <div className="sidebar">
        <h2>Account</h2> {/* Removed username from here */}

        <hr />
        <div className="section-title">ORDERS</div>
        <ul>
          <li><NavLink to="/profile/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink></li>  
        </ul>

        <hr />
        {/* <div className="section-title">CREDITS</div>
        <ul>
          <li><NavLink to="/profile/coupons" className={({ isActive }) => isActive ? 'active' : ''}>Coupons</NavLink></li>  
        </ul> */}

        <hr />
        <div className="section-title">ACCOUNT</div>
        <ul>
          <li><NavLink to="/profile" end className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>  
          <li><NavLink to="/profile/saved-address" className={({ isActive }) => isActive ? 'active' : ''}>Saved Address</NavLink></li>
          {/* <li><NavLink to="/profile/saved-upi" className={({ isActive }) => isActive ? 'active' : ''}>Saved UPI</NavLink></li> */}
          <li><NavLink to="/profile/delete-account" className={({ isActive }) => isActive ? 'active' : ''}>Delete Account</NavLink></li>
        </ul>

        <hr />
        <div className="section-title">MORE</div>
        <ul>
          <li><NavLink to="/profile/feedback" className={({ isActive }) => isActive ? 'active' : ''}>Feedback</NavLink></li>
          <li><NavLink to="/profile/support" className={({ isActive }) => isActive ? 'active' : ''}>Support</NavLink></li>
          <li><NavLink to="/profile/help-center" className={({ isActive }) => isActive ? 'active' : ''}>Help Center</NavLink></li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarProf;
