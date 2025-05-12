// ProfileForm.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ProfileForm.css";
import SERVER_URL from "../../../config";

const ProfileForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state?.user) {
      setFormData({
        fullName: state.user.name || "",
        mobile: state.user.phone || "",
        email: state.user.email || "",
        gender: state.user.gender || "",
        dob: state.user.dob || "",
        address: state.user.address || "",
      });
    }
  }, [state]);

  const validateFields = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.fullName.trim() || !/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Full Name must contain only letters";
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!/^[\w._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.dob || formData.dob > today) {
      newErrors.dob = "Enter a valid Date of Birth";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const token = localStorage.getItem("token");
      const { id } = token ? JSON.parse(atob(token.split(".")[1])) : {};

      await axios.put(
        `${SERVER_URL}/api/users/${id}`,
        {
          name: formData.fullName,
          phone: formData.mobile,
          email: formData.email,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}

            <label>Mobile Number</label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleMobileInput} />
            {errors.mobile && <span className="error">{errors.mobile}</span>}

            <label>Email ID</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}

            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            {errors.dob && <span className="error">{errors.dob}</span>}

            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <span className="error">{errors.address}</span>}

            <button type="submit" className="edit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
