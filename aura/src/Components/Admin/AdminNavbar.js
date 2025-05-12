import React, { useContext } from "react";
import "./AdminNavbar.css";
import logo from "../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginContext";
const AdminNavbar = () => {
  const { isLoggedIn, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-navbar">
      <div className="admin-nav-logo">
        <img src={logo} alt="logo" style={{ width: "120px", height: "auto" }} />
      </div>

      <div className="admin-nav-auth">
        {isLoggedIn || token ? (
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        ) : (
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
