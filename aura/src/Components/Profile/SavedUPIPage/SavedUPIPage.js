import React, { useState, useEffect } from "react";
import "./SavedUPIPage.css"; // Import CSS

const SavedUPIPage = () => {
  // State to store user UPI IDs (empty for now)
  const [upiList, setUpiList] = useState([]);

  // Simulate fetching data (empty array for now)
  useEffect(() => {
    // Later, fetch UPI IDs from an API or local storage
    setUpiList([]); // Empty for now
  }, []);

  return (
    <div className="saved-upi-page">
      <div className="saved-upi-content">
        <h2>Saved UPI IDs</h2>

        {upiList.length === 0 ? (
          <p className="no-upi">No saved UPI IDs found.</p>
        ) : (
          <ul className="upi-list">
            {upiList.map((upi, index) => (
              <li key={index} className="upi-item">
                <p>{upi}</p>
                <div className="upi-buttons">
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

export default SavedUPIPage;
