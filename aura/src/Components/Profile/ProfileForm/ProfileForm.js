// src/components/ProfileForm.js
import React, { useState } from 'react';
import './ProfileForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.fullName.trim() || !/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full Name must contain only letters';
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dob || formData.dob > today) {
      newErrors.dob = 'Enter a valid Date of Birth';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const response = await axios.post('http://localhost:3000/ProfileForm', formData);
      console.log('Submit successful:', response.data);
      alert('Submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Submission failed!');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-card">
          <h2>Profile Details</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}

            <label>Mobile Number</label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
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

            <button type="submit" className="edit-btn">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
