import React, { useState } from 'react';
import './NewsLetter.css';
import SERVER_URL from '../../../config';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); // Assuming you store the user ID in localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null); // Reset error before sending request

    try {
      const response = await fetch(`${SERVER_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setEmail(''); // Reset email input field
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error details:", error); // Log detailed error
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='newsletter'>
      <h1>Unlock Exclusive Deals Via Your Email</h1>
      <p>Subscribe to our newsletter and get updated!</p>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Please Provide Your MailID'
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NewsLetter;