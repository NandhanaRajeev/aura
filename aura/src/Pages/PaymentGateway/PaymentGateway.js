import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './PaymentGateway.css';

const PaymentGateway = () => {
  const [selectedOption, setSelectedOption] = useState('upi'); // Default to UPI for immediate fetch
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [rememberUpi, setRememberUpi] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [inputWarnings, setInputWarnings] = useState({});
  const [message, setMessage] = useState('');

  // Fetch saved UPI ID on mount or when UPI option is selected
  useEffect(() => {
    const fetchUserUpi = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to retrieve saved UPI ID.');
          return;
        }

        const { id } = jwtDecode(token);
        const response = await axios.get(`http://localhost:3000/api/upi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only set UPI ID and rememberUpi if they exist and rememberUpi is true
        if (response.data.upiId && response.data.rememberUpi) {
          setUpiId(response.data.upiId);
          setRememberUpi(response.data.rememberUpi);
        } else {
          // Clear fields if no saved UPI ID or rememberUpi is false
          setUpiId('');
          setRememberUpi(false);
        }
      } catch (error) {
        // Only show error message for actual errors, not when no UPI ID is found
        if (error.response?.status !== 404) {
          console.error('Error fetching UPI ID:', error);
          setMessage('Failed to fetch saved UPI ID.');
        }
        // Clear fields on 404 (no saved UPI ID)
        setUpiId('');
        setRememberUpi(false);
      }
    };

    if (selectedOption === 'upi') {
      fetchUserUpi();
    }
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setErrorMessages({});
    setInputWarnings({});
    setMessage('');
    // Clear fields only if not switching to UPI
    if (event.target.value !== 'upi') {
      setUpiId('');
      setRememberUpi(false);
    }
    setCardNumber('');
    setCardName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setBank('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (selectedOption === 'card') {
      if (!/^\d{16}$/.test(cardNumber)) {
        errors.cardNumber = 'Card number must be exactly 16 digits';
      }
      if (!/^[A-Za-z\s]+$/.test(cardName.trim())) {
        errors.cardName = 'Name must contain only letters and spaces';
      }
      const mm = parseInt(expiryMonth, 10);
      if (!/^\d{2}$/.test(expiryMonth) || mm < 1 || mm > 12) {
        errors.expiryMonth = 'Enter a valid month (01-12)';
      }
      if (!/^\d{2}$/.test(expiryYear)) {
        errors.expiryYear = 'Enter a valid year (last 2 digits)';
      }
      if (!/^\d{3}$/.test(cvv)) {
        errors.cvv = 'CVV must be 3 digits';
      }
    }

    if (selectedOption === 'upi') {
      if (!upiId.trim()) {
        errors.upiId = 'Enter a valid UPI ID';
      } else if (!/^[\w.-]+@[\w]+$/.test(upiId)) {
        errors.upiId = 'Invalid UPI format';
      }
    }

    if (selectedOption === 'netbanking' && !bank) {
      errors.bank = 'Select a bank';
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      // Handle UPI saving if "Remember UPI" is checked
      if (selectedOption === 'upi' && rememberUpi) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setMessage('Please log in to save UPI ID.');
            return;
          }

          await axios.post(
            'http://localhost:3000/api/upi/save',
            { upiId, rememberUpi },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessage('UPI ID saved successfully!');
        } catch (error) {
          console.error('Error saving UPI ID:', error);
          setMessage('Failed to save UPI ID.');
          return;
        }
      }

      // Proceed with payment (mock for now)
      alert(`Payment method: ${selectedOption} submitted successfully!`);
    }
  };

  return (
    <div className="payment-container">
      <h2>Choose Payment Method</h2>
      {message && <p className={message.includes('Failed') ? 'error' : 'success'}>{message}</p>}
      <form onSubmit={handlePaymentSubmit}>
        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              value="card"
              checked={selectedOption === 'card'}
              onChange={handleOptionChange}
            />
            Credit/Debit Card
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="upi"
              checked={selectedOption === 'upi'}
              onChange={handleOptionChange}
            />
            UPI
          </label>
          <label className="payment-option">
            <input
              type="radio"
              value="netbanking"
              checked={selectedOption === 'netbanking'}
              onChange={handleOptionChange}
            />
            Net Banking
          </label>
        </div>

        {/* Card Payment Fields */}
        {selectedOption === 'card' && (
          <div className="payment-details">
            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              value={cardNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setCardNumber(val);
                if (val && !/^\d*$/.test(val)) {
                  setInputWarnings((prev) => ({
                    ...prev,
                    cardNumber: 'Only numbers allowed',
                  }));
                } else {
                  setInputWarnings((prev) => ({ ...prev, cardNumber: '' }));
                }
              }}
              required
            />
            {inputWarnings.cardNumber && (
              <p className="warning">{inputWarnings.cardNumber}</p>
            )}
            {errorMessages.cardNumber && (
              <p className="error">{errorMessages.cardNumber}</p>
            )}

            <input
              type="text"
              placeholder="Name on Card"
              value={cardName}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[A-Za-z\s]*$/.test(val)) {
                  setCardName(val);
                  setInputWarnings((prev) => ({ ...prev, cardName: '' }));
                } else {
                  setInputWarnings((prev) => ({
                    ...prev,
                    cardName: 'Only letters and spaces allowed',
                  }));
                }
              }}
              required
            />
            {inputWarnings.cardName && (
              <p className="warning">{inputWarnings.cardName}</p>
            )}
            {errorMessages.cardName && (
              <p className="error">{errorMessages.cardName}</p>
            )}

            <div className="expiry-wrapper">
              <input
                type="text"
                placeholder="MM"
                maxLength={2}
                value={expiryMonth}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setExpiryMonth(val);
                  const mm = parseInt(val, 10);
                  if (val.length === 2 && (mm < 1 || mm > 12)) {
                    setInputWarnings((prev) => ({
                      ...prev,
                      expiryMonth: 'Only 01 to 12 allowed',
                    }));
                  } else {
                    setInputWarnings((prev) => ({ ...prev, expiryMonth: '' }));
                  }
                }}
                required
              />
              <input
                type="text"
                placeholder="YY"
                maxLength={2}
                value={expiryYear}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setExpiryYear(val);
                }}
                required
              />
            </div>
            {inputWarnings.expiryMonth && (
              <p className="warning">{inputWarnings.expiryMonth}</p>
            )}
            {errorMessages.expiryMonth && (
              <p className="error">{errorMessages.expiryMonth}</p>
            )}
            {errorMessages.expiryYear && (
              <p className="error">{errorMessages.expiryYear}</p>
            )}

            <input
              type="text"
              placeholder="CVV"
              maxLength={3}
              value={cvv}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setCvv(val);
              }}
              required
            />
            {errorMessages.cvv && <p className="error">{errorMessages.cvv}</p>}
          </div>
        )}

        {/* UPI Payment Fields */}
        {selectedOption === 'upi' && (
          <div className="payment-details">
            <input
              type="text"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={(e) => {
                const val = e.target.value;
                setUpiId(val);
                if (val && !/^[\w.-]+@[\w]+$/.test(val)) {
                  setInputWarnings((prev) => ({
                    ...prev,
                    upiId: 'Invalid format. Try something like name@bank',
                  }));
                } else {
                  setInputWarnings((prev) => ({ ...prev, upiId: '' }));
                }
              }}
              required
            />
            {inputWarnings.upiId && <p className="warning">{inputWarnings.upiId}</p>}
            {errorMessages.upiId && <p className="error">{errorMessages.upiId}</p>}

            <div className="remember-upi">
              <input
                type="checkbox"
                id="rememberUpi"
                checked={rememberUpi}
                onChange={(e) => setRememberUpi(e.target.checked)}
              />
              <label htmlFor="rememberUpi">Remember this UPI ID for next time</label>
            </div>
          </div>
        )}

        {/* Net Banking Fields */}
        {selectedOption === 'netbanking' && (
          <div className="payment-details">
            <select value={bank} onChange={(e) => setBank(e.target.value)} required>
              <option value="">Select Bank</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
            {errorMessages.bank && <p className="error">{errorMessages.bank}</p>}
          </div>
        )}

        <button className="btn-success" type="submit">
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentGateway;