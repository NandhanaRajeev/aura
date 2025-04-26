import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./SavedaddressPage.css";

const SavedaddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { id } = jwtDecode(token);

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        if (user.address) {
          setAddresses([user.address]);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setAddresses([]);
      }
    };

    fetchAddress();
  }, []);

  const handleAddAddress = () => {
    navigate("/profile/address-form"); // ✅ Redirect to Address Form
  };

  return (
    <div className="saved-address-page">
      <div className="saved-address-content">
        <div className="address-header">
          <h2>Saved Addresses</h2>
          <button className="add-address-btn" onClick={handleAddAddress}>
            + Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="no-address">No saved addresses found.</p>
        ) : (
          <ul className="address-list">
            {addresses.map((address, index) => (
              <li key={index} className="address-item">
                <p>{address}</p>
                <div className="address-buttons">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedaddressPage;
