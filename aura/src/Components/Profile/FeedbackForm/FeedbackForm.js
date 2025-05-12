import React, { useState } from 'react';
import './FeedbackForm.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../../config'; // ✅ Import SERVER_URL

const FeedbackForm = () => {
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    rating: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};

    if (!feedbackData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(feedbackData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!feedbackData.rating) {
      newErrors.rating = 'Rating is required';
    }

    if (!feedbackData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const response = await axios.post(`${SERVER_URL}/api/feedback`, feedbackData); // ✅ Updated URL
      console.log('Feedback submitted:', response.data);
      alert('Feedback submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Feedback submission failed.');
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-content">
        <div className="feedback-card">
          <h2>Feedback</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="user_name"
              name="name" 
              value={feedbackData.name} 
              onChange={handleChange} 
              autoComplete="name"
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              value={feedbackData.email} 
              onChange={handleChange} 
              autoComplete="email"
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label htmlFor="rating">Rating</label>
            <select 
              id="rating"
              name="rating" 
              value={feedbackData.rating} 
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              <option value="1">1 </option>
              <option value="2">2 </option>
              <option value="3">3 </option>
              <option value="4">4 </option>
              <option value="5">5 </option>
            </select>
            {errors.rating && <span className="error">{errors.rating}</span>}

            <label htmlFor="comments">Comments</label>
            <textarea 
              id="comments"
              name="comments" 
              rows="4" 
              value={feedbackData.comments} 
              onChange={handleChange} 
            />
            {errors.comments && <span className="error">{errors.comments}</span>}

            <button type="submit" className="submit-btn">
              SUBMIT FEEDBACK
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
