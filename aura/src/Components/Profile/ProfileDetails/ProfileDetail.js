// ProfileDetail.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ProfileDetail.css";
import SERVER_URL from "../../../config";

const ProfileDetail = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to format the date as DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "Not provided";
    }

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { id } = jwtDecode(token);
    axios
      .get(`${SERVER_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  if (!user) {
    return (
      <div className="profile-wrapper">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2 className="profile-heading">Welcome, {user.name}!</h2>

        <div className="profile-details">
          <div className="detail-item">
            <strong>Full Name:</strong> <span>{user.name}</span>
          </div>
          <div className="detail-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <strong>Mobile Number:</strong> <span>{user.phone || "Not provided"}</span>
          </div>
          <div className="detail-item">
            <strong>Gender:</strong> <span>{user.gender || "Not provided"}</span>
          </div>
          <div className="detail-item">
            <strong>Date of Birth:</strong> <span>{formatDate(user.dob)}</span>
          </div>
          <div className="detail-item">
            <strong>Address:</strong> <span>{user.address || "Not provided"}</span>
          </div>
        </div>

        <button
          className="edit-button"
          onClick={() => navigate("profile-form", { state: { user } })}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDetail;
