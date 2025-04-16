import React, { useState, useEffect } from "react";
import "./SavedaddressPage.css"; // Import CSS

const SavedaddressPage = () => {
  // State to store user addresses (empty for now)
  const [addresses, setAddresses] = useState([]);

  // Simulate fetching data (empty array for now)
  useEffect(() => {
    // Later, fetch user addresses from an API or local storage
    setAddresses([]); // Empty for now
  }, []);

  return (
    <div className="saved-address-page">
      <div className="saved-address-content">
        <h2>Saved Addresses</h2>

        {addresses.length === 0 ? (
          <p className="no-address">No saved addresses found.</p>
        ) : (
          <ul className="address-list">
            {addresses.map((address, index) => (
              <li key={index} className="address-item">
                <p>{address}</p>
                <div className="address-buttons">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedaddressPage;
