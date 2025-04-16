import React, { useState } from "react";
import "./DeleteAccountPage.css"; // Import CSS

const DeleteAccountPage = () => {
  const [confirmation, setConfirmation] = useState(false);

  return (
    <div className="delete-account-page">
      <div className="delete-account-content">
        <h2>Delete Your Account</h2>
        <p>Once you delete your account, all your data will be permanently removed.</p>

        {!confirmation ? (
          <button className="delete-btn" onClick={() => setConfirmation(true)}>
            Delete Account
          </button>
        ) : (
          <div className="confirmation-box">
            <p>Are you sure? This action cannot be undone.</p>
            <div className="confirmation-buttons">
              <button className="confirm-btn">Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setConfirmation(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountPage;
