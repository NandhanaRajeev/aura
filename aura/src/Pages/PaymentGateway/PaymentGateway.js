import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './PaymentGateway.css';
<<<<<<< HEAD
import SERVER_URL from "../../../config";
=======
import SERVER_URL from '../../config';
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174

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
<<<<<<< HEAD
        const response = await axios.get(${SERVER_URL}/api/upi/get, {
          headers: { Authorization: Bearer ${token} },
=======
        const response = await axios.get(`${SERVER_URL}/api/upi/get`, {
          headers: { Authorization: `Bearer ${token}` },
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
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
            console.log(UPI Entry in prefill: ${JSON.stringify(upi)}, Valid: ${isValid});
            return isValid;
          })
          .map((upi) => upi.upiId);

        console.log('Processed UPI IDs in prefill:', upiIds);
        setSavedUpiIds(upiIds);

        if (upiIds.length === 0) {
          setMessage('No saved UPI IDs found in the database.');
        }
      } catch (error) {
        console.error('Error fetching UPI ID for prefill:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status !== 404) {
          setMessage('Failed to fetch saved UPI ID.');
        }
        setSavedUpiIds([]);
      }
    };

    if (selectedOption === 'upi') {
      fetchUserUpi();
    }
  }, [selectedOption]);

  const validateToken = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp < currentTime) {
        console.log("Token expired:", decoded);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  // Clear the cart
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    const isLoggedIn = token && validateToken(token);

    setCartItems([]);

    if (isLoggedIn && token) {
      try {
<<<<<<< HEAD
        await axios.delete(${SERVER_URL}/api/cart/clear, {
          headers: {
            Authorization: Bearer ${token},
=======
        await axios.delete(`${SERVER_URL}/api/cart/clear`, {
          headers: {
            Authorization: `Bearer ${token}`,
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
          },
        });
        console.log("Cart cleared in backend");
      } catch (error) {
        console.error("Error clearing cart from backend:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCartItems([]);
          localStorage.removeItem("cartItems");
          alert("Your session has expired. Please log in again.");
        }
      }
    }
    localStorage.removeItem("cartItems");
  };

  // Transfer cart to orders after payment
  const transferCartToOrders = async () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("userId");
    const isLoggedIn = token && validateToken(token);

    if (!isLoggedIn || !token || !validateToken(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setCartItems([]);
      localStorage.removeItem("cartItems");
      alert("Your session has expired. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
<<<<<<< HEAD
        ${SERVER_URL}/api/checkout,
=======
        `${SERVER_URL}/api/checkout`,
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
        { user_id: user_id },
        {
          headers: {
            Authorization: Bearer ${token},
          },
        }
      );
      console.log("Transferred cart items to orders:", response.data);
      await clearCart(); // Clear cart after successful transfer
    } catch (error) {
      console.error("Error transferring cart to orders:", error.response?.data || error.message);
      alert("Failed to complete order. Please try again.");
    }
  };

  const handleUpiSelect = (selectedUpiId) => {
    setUpiId(selectedUpiId);
    setRememberUpi(true);
    setShowSavedUpiIds(false);
    setInputWarnings((prev) => ({ ...prev, upiId: '' }));
    setErrorMessages((prev) => ({ ...prev, upiId: '' }));
  };

  const toggleSavedUpiIds = async () => {
    const willShow = !showSavedUpiIds;
    setShowSavedUpiIds(willShow);
    const token = localStorage.getItem('token');

    // Fetch UPI IDs only when showing the list
    if (willShow) {
      try {
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

        console.log('Fetching UPI IDs for user ID (from token):', decodedToken.id);
        console.log('Token being sent:', token);

<<<<<<< HEAD
        const response = await axios.get(${SERVER_URL}/api/upi/get, {
          headers: { Authorization: Bearer ${token} },
=======
        const response = await axios.get(`${SERVER_URL}/api/upi/get`, {
          headers: { Authorization: `Bearer ${token}` },
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
        });

        console.log('API Response:', response);
        console.log('Response Data:', response.data);

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
          console.log('Unexpected response data structure:', response.data);
        }

        console.log('Normalized UPI Data:', upiData);

        const upiIds = upiData
          .filter((upi) => {
            const isValid = upi.upiId && upi.rememberUpi;
            console.log(UPI Entry: ${JSON.stringify(upi)}, Valid: ${isValid});
            return isValid;
          })
          .map((upi) => upi.upiId);

        console.log('Processed UPI IDs:', upiIds);
        setSavedUpiIds(upiIds);

        if (upiIds.length === 0) {
          setMessage('No saved UPI IDs found in the database.');
        }
      } catch (error) {
        console.error('Error fetching UPI IDs:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setSavedUpiIds([]);
        setMessage(
          error.response?.status === 404
            ? 'No saved UPI IDs found.'
            : 'Failed to fetch saved UPI IDs.'
        );
      }
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setErrorMessages({});
    setInputWarnings({});
    setMessage('');
    if (event.target.value !== 'upi') {
      setUpiId('');
      setSavedUpiIds([]);
      setShowSavedUpiIds(false);
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
<<<<<<< HEAD
            ${SERVER_URL}/api/upi/save,
=======
            `${SERVER_URL}/api/upi/save`,
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
            { upiId, rememberUpi },
            { headers: { Authorization: Bearer ${token} } }
          );
          setMessage('UPI ID saved successfully!');
        } catch (error) {
          console.error('Error saving UPI ID:', error);
          setMessage('Failed to save UPI ID.');
          return;
        }
      }

      // Proceed with payment (mock for now)
      alert(Payment method: ${selectedOption} submitted successfully!);
      alert(Order placed successfully!);

      // Delay navigation slightly to ensure alerts show first
      setTimeout(() => {
        transferCartToOrders();
<<<<<<< HEAD
        navigate(/profile/orders/${user_id});
=======
        navigate(`/profile/orders/${user_id}`);
>>>>>>> 5434863faaa8b07e14228132fef68369f0bb1174
      }, 100); // Adjust delay if needed
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
              onChange={(

e) => {
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

            <button
              type="button"
              onClick={toggleSavedUpiIds}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {showSavedUpiIds ? 'Hide Saved UPI IDs' : 'Saved UPI IDs'}
            </button>

            {showSavedUpiIds && (
              <div className="saved-upi-list" style={{ marginTop: '10px' }}>
                {savedUpiIds.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {savedUpiIds.map((savedUpi, index) => (
                      <li
                        key={index}
                        onClick={() => handleUpiSelect(savedUpi)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: savedUpi === upiId ? '#e0e0e0' : '#f9f9f9',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          margin: '5px 0',
                          cursor: 'pointer',
                        }}
                      >
                        {savedUpi}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved UPI IDs found.</p>
                )}
              </div>
            )}
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