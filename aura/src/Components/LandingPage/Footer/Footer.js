import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ABOUT SECTION */}
        <div className="footer-section">
          <h3>ABOUT</h3>
          <ul>
            <li><Link to="/support">Contact Us</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/aurastories">Aura Stories</Link></li>
          </ul>
        </div>

        {/* HELP SECTION */}
        <div className="footer-section">
          <h3>HELP</h3>
          <ul>
            <li><Link to="/helpcenter">Cancellation & Return</Link></li>
            <li><Link to="/helpcenter">FAQ</Link></li>
          </ul>
        </div>

        {/* CONSUMER POLICY SECTION */}
        <div className="footer-section">
          <h3>CONSUMER POLICY</h3>
          <ul>
            <li><Link to="/terms">Terms of Use</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>

        {/* CONTACT US SECTION */}
        <div className="footer-section">
          <h3>CONTACT US</h3>
          <ul>
            <li>+91 - 8032142621</li>
            <li><a href="mailto:Aura@gmail.com">Aura@gmail.com</a></li>
          </ul>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="footer-bottom">
        <div className="bottom-links">
          <Link to="/helpcenter">Help Center</Link>
        </div>
        <p>© 2007 - 2025 Aura.com</p>
        <div className="keep-in-touch">
          <h4>KEEP IN TOUCH</h4>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
