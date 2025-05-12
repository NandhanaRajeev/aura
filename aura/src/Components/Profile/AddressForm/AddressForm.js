import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AddressForm.css";
import SERVER_URL from '../../config';

const AddressForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);

  // Pre-fill if editing
  useEffect(() => {
    if (state?.address) {
      setFormData({
        fullName: state.address.fullName || "",
        mobile: state.address.mobile || "",
        address: state.address.address || "",
        pincode: state.address.pincode || "",
      });
      setIsEditMode(true);
      setAddressId(state.address.add_id); // Assuming your address object has an add_id field
    }
  }, [state]);

  const validateFields = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || !/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Full Name must contain only letters";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMobileInput = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,10}$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePincodeInput = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in!");
        return;
      }
  
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      if (isEditMode) {
        // Edit Mode: Update address
        await axios.put(
          `${SERVER_URL}/api/address/${addressId}`,
          {
            fullName: formData.fullName,
            mobile: formData.mobile,
            address: formData.address,
            pincode: formData.pincode,
          },
          config
        );
        alert("Address updated successfully!");
      } else {
        // Add Mode: Add new address
        await axios.post(
          `${SERVER_URL}/api/address`,
          {
            fullName: formData.fullName,
            mobile: formData.mobile,
            address: formData.address,
            pincode: formData.pincode,
          },
          config
        );
        alert("Address added successfully!");
      }
  
      navigate("/profile/saved-address");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Submission failed!");
    }
  };
  

  return (
    <div className="address-page">
      <div className="address-content">
        <div className="address-card">
          <h2>{isEditMode ? "Edit Address" : "Add New Address"}</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}

            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleMobileInput}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error">{errors.address}</span>}

            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handlePincodeInput}
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}

            <button type="submit" className="edit-btn">
              {isEditMode ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
