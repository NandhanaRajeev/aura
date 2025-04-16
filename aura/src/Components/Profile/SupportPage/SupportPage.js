import React from "react";
import "./SupportPage.css"; // Import CSS

const SupportPage = () => {
  return (
    <div className="support-page">
      <div className="support-content">
        <h2>Support Page</h2>
        <p>If you have any issues or need help, please contact our support team.</p>

        <div className="support-info">
          <ul>
            <li>📧 <strong>Email:</strong> <a href="mailto:aura@gmail.com">aura@gmail.com</a></li>
            <li>📞 <strong>Phone:</strong> +91 - 8032142621</li>
            <li>💬 <strong>Live Chat:</strong> Available 9 AM - 5 PM</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
