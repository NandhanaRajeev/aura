import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./SavedaddressPage.css";
import SERVER_URL from "../../../config";

const SavedaddressPage = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const userId = decoded.user_id || decoded.id;

  const fetchAddress = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${SERVER_URL}/api/address/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const addressData = response.data;
      setAddress(Array.isArray(addressData) ? addressData : []);
    } catch (err) {
      console.error("❌ Failed to fetch address:", err);
      setAddress([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAddAddress = () => {
    navigate("/profile/address-form");
  };

  const handleEdit = (item) => {
    navigate("/profile/address-form", { state: { address: item } });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`${SERVER_URL}/api/address/${id}`, config);
      alert("Address deleted successfully!");

      // Update the state to remove the deleted address
      setAddress((prevAddress) => prevAddress.filter((item) => item.add_id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete address");
    }
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

        {loading ? (
          <p>Loading...</p>
        ) : address.length === 0 ? (
          <p className="no-address">No saved addresses found.</p>
        ) : (
          <ul className="address-list">
            {address.map((item) => (
              <li key={item.add_id} className="address-item">
                <p><strong>{item.fullName}</strong></p>
                <p>Mobile: {item.mobile}</p>
                <p>Address: {item.address}</p>
                <p>Pincode: {item.pincode}</p>
                <div className="address-buttons">
                  <button className="edit-bton" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.add_id)}>Delete</button>
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
