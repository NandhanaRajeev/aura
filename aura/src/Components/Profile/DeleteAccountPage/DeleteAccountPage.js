import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import "./DeleteAccountPage.css";

const DeleteAccountPage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to delete your account.");
        navigate("/login");
        return;
      }
    
      try {
        const { data } = await axios.get(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error);
    
        // Log the error response for more information
        if (error.response) {
          console.error("Response error data:", error.response.data);
          console.error("Response error status:", error.response.status);
          console.error("Response error headers:", error.response.headers);
          setMessage("Error fetching user data. Please try again.");
          
          if (error.response.status === 500) {
            setMessage("Internal Server Error. Please try again later.");
          }
        }
        navigate("/login");
      }
    };
    

    fetchUserData();
  }, [API, navigate]);

  // Handle account deletion
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      setMessage("No user found or not logged in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(`${API}/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMessage("Account deleted successfully.");
        // Clear token and log out
        localStorage.removeItem("token");
        
        // Redirect to login page after successful deletion
        setTimeout(() => {
          navigate("/login");
        }, 1000); // Brief delay to show success message
      } else {
        setMessage("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Error during account deletion.");
    } finally {
      setConfirmation(false);
    }
  };

  return (
    <div className="delete-account-page">
      <div className="delete-account-content">
        <h2>Delete Your Account</h2>
        <p>Once you delete your account, all your data will be permanently removed.</p>

        {message && <p className="message">{message}</p>}

        {!confirmation ? (
          <button className="delete-btn" onClick={() => setConfirmation(true)}>
            Delete Account
          </button>
        ) : (
          <div className="confirmation-box">
            <p>Are you sure? This action cannot be undone.</p>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={() => setConfirmation(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;
