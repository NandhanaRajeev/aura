import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuraStories.css';

const AuraStories = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/feedback');
        setFeedbackList(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="aura-wrapper">
      <div className="heading-box">
        <h2>✨ Aura Stories - Customer Feedback</h2>
      </div>

      {loading ? (
        <p className="status">Loading...</p>
      ) : error ? (
        <p className="status error">{error}</p>
      ) : feedbackList.length === 0 ? (
        <p className="status">No feedback submitted yet.</p>
      ) : (
        <div className="aura-card-container">
          {feedbackList.map((fb, index) => (
            <div key={index} className="aura-card">
              <h4>{fb.name}</h4>
              <p className="rating">⭐ {fb.rating}/5</p>
              <p className="comment">"{fb.comments}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuraStories;
