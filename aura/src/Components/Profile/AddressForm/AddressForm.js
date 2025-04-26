import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AddressForm.css";

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

  // Pre-fill if editing
  useEffect(() => {
    if (state?.user) {
      setFormData({
        fullName: state.address.name || "",
        mobile: state.address.phone || "",
        address: state.address.address || "",
        pincode: state.address.pincode || "",
      });
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
      const { id } = token ? JSON.parse(atob(token.split(".")[1])) : {};

      await axios.put(
        `http://localhost:3000/api/address/${id}`,
        {
          fullName: formData.fullName,
          mobile: formData.mobile,
          address: formData.address,
          pincode: formData.pincode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Address updated successfully!");
      navigate("/address");
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    }
  };

  return (
    <div className="address-page">
      <div className="address-content">
        <div className="address-card">
          <h2>{state?.user ? "Edit Address" : "Add New Address"}</h2>
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
