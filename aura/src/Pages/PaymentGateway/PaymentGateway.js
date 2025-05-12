import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './PaymentGateway.css';
import SERVER_URL from '../../config';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [savedUpiIds, setSavedUpiIds] = useState([]);
  const [showSavedUpiIds, setShowSavedUpiIds] = useState(false);
  const [bank, setBank] = useState('');
  const [rememberUpi, setRememberUpi] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [inputWarnings, setInputWarnings] = useState({});
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');

  const user_id = localStorage.getItem('userId');

  // Fetch and store all saved UPI IDs on mount or when UPI option is selected
  useEffect(() => {
    const fetchUserUpi = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to retrieve saved UPI IDs.');
          console.log('No token found in localStorage.');
          return;
        }

        let decodedToken;
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          console.error('Error decoding token:', error);
          setMessage('Invalid or expired token. Please log in again.');
          return;
        }

        console.log('Fetching UPI IDs for prefill for user ID:', decodedToken.id);
        const response = await axios.get(`${SERVER_URL}/api/upi/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response for prefill:', response);
        console.log('Response Data for prefill:', response.data);

        // Normalize the response data to the expected format
        let upiData = [];
        if (Array.isArray(response.data)) {
          upiData = response.data.map((upi) => ({
            upiId: upi.upi_id,
            rememberUpi: !!upi.remember_upi,
          }));
        } else if (response.data && response.data.upi_id) {
          upiData = [{
            upiId: response.data.upi_id,
            rememberUpi: !!response.data.remember_upi,
          }];
        } else {
          console.log('Unexpected response data structure in prefill:', response.data);
        }

        console.log('Normalized UPI Data in prefill:', upiData);

        // Store all valid UPI IDs (where rememberUpi is true)
        const upiIds = upiData
          .filter((upi) => {
            const isValid = upi.upiId && upi.rememberUpi;
            return isValid;
          })
          .map((upi) => upi.upiId);

        console.log('Filtered UPI IDs:', upiIds);
        setSavedUpiIds(upiIds);
      } catch (error) {
        console.error('Error fetching UPI IDs:', error);
        setMessage('Failed to retrieve UPI IDs.');
      }
    };

    if (selectedOption === 'upi') {
      fetchUserUpi();
    }
  }, [selectedOption]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle payment submission logic here
  };

  return (
    <div className="payment-gateway">
      <h2>Payment Gateway</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Payment Option */}
        <div>
          <label>
            <input
              type="radio"
              value="upi"
              checked={selectedOption === 'upi'}
              onChange={() => handleSelectOption('upi')}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              value="card"
              checked={selectedOption === 'card'}
              onChange={() => handleSelectOption('card')}
            />
            Credit/Debit Card
          </label>
        </div>

        {/* UPI Form Fields */}
        {selectedOption === 'upi' && (
          <div>
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <button type="button" onClick={() => setShowSavedUpiIds(!showSavedUpiIds)}>
              {showSavedUpiIds ? 'Hide' : 'Show'} Saved UPI IDs
            </button>
            {showSavedUpiIds && (
              <div>
                {savedUpiIds.length > 0 ? (
                  savedUpiIds.map((id) => (
                    <div key={id}>
                      <label>
                        <input
                          type="radio"
                          value={id}
                          checked={upiId === id}
                          onChange={() => setUpiId(id)}
                        />
                        {id}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No saved UPI IDs available.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Payment Form Fields */}
        {selectedOption === 'card' && (
          <div>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <label htmlFor="expiryMonth">Expiry Month</label>
            <input
              type="text"
              id="expiryMonth"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
            />
            <label htmlFor="expiryYear">Expiry Year</label>
            <input
              type="text"
              id="expiryYear"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
            />
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        )}

        {/* Error and Success Message */}
        {message && <p>{message}</p>}

        {/* Submit Button */}
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default PaymentGateway;
