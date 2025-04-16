import React from "react";
import { Link } from "react-router-dom"; // Using Link for navigation
import "./HelpCenterPage.css"; // Import CSS

const HelpCenterPage = () => {
  return (
    <div className="help-center-page">
      <div className="help-center-content">
        <h2>Help Center</h2>
        <p>Find answers to frequently asked questions or contact our support team.</p>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-item">
            <h4>🔑 How do I reset my password?</h4>
            <p>You can reset your password from the login page by clicking on "Forgot Password?"</p>
          </div>
          <div className="faq-item">
            <h4>📦 How can I track my order?</h4>
            <p>Go to the "Orders" section in your profile to check your order status.</p>
          </div>
          <div className="faq-item">
            <h4>📞 How do I contact customer support?</h4>
            <p>
              You can reach us via email at <strong><a href="mailto:aurasupport@gmail.com">aurasupport@gmail.com</a> </strong> 
               or call us at <strong>+91 8032142621</strong>.
            </p>
          </div>
        </div>

        <div className="contact-section">
          <h3>Need More Help?</h3>
          <Link to="/profile/support">
            <button className="contact-btn">Contact Support</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
