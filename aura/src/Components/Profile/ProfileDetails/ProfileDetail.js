import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileDetail.css"; // Import CSS file


const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const userId = 6; // Replace with dynamic ID if needed

  // useEffect(() => {
  //   fetch(`http://localhost:3000/api/users/${userId}`)
  //     .then((response) => response.json())
  //     .then((data) => setUser(data))
  //     .catch((error) => console.error("Error fetching user data:", error));
  // }, []);
  useEffect(() => {
    fetch(`http://localhost:3000/api/user_details/${userId}`)  // <-- update port if backend is on 5000
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("Expected JSON but got something else (possibly HTML)");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);
  

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2 className="profile-heading">User Profile</h2>
        
        <div className="profile-details">
          <p><strong>Full Name:</strong> {user.full_name}</p>
          <p><strong>Mobile Number:</strong> {user.mobile_number}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
  
        <button className="edit-button" onClick={() => navigate("ProfileForm")}>
          Edit Profile
        </button>
      </div>
    </div>
  );
  
};

export default ProfilePage;
