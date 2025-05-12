import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DeleteAccountPage.css";
import SERVER_URL from "../../../config";

const DeleteAccountPage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in to delete your account.");
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${SERVER_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response) {
          console.error("Response error data:", error.response.data);
          setMessage("Error fetching user data. Please try again.");
          if (error.response.status === 500) {
            setMessage("Internal Server Error. Please try again later.");
          }
        }
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("No user found or not logged in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(`${SERVER_URL}/api/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMessage("Account deleted successfully.");
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
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
      <div className="delete-account-card">
        <h2>Account Settings</h2>
        <hr className="divider" />
        <h3>Delete Your Account</h3>
        <p>Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>

        {confirmation ? (
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
        ) : (
          <button className="delete-btn" onClick={() => setConfirmation(true)}>
            <span className="warning-icon">⚠️</span> Delete Account
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;
