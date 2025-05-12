import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css"; // Create this for custom styles

const AdminSidebar = () => {
  return (
    <div className="admin-flex-container">
      <div className="admin-sidebar">
        <NavLink to="/admin" className="admin-panel-link">
          <h2>Admin Panel</h2>
        </NavLink>

        <hr />
        <div className="admin-section-title">MANAGE</div>
        <ul>
          <li>
            <NavLink
              to="/admin/cart"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/feedback"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Feedback
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Products
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/wishlist"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Wishlist
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
