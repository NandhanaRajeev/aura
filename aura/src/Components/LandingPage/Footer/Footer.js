import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import dicovercard_icon from "../../Assets/dicovercard_icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ABOUT SECTION */}
        <div className="footer-section">
          <h3>ABOUT</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Aura Stories</a></li>
          </ul>
        </div>

        {/* HELP SECTION */}
        <div className="footer-section">
          <h3>HELP</h3>
          <ul>
            <li><a href="#">Payments</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Cancellation & Return</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* CONSUMER POLICY SECTION */}
        <div className="footer-section">
          <h3>CONSUMER POLICY</h3>
          <ul>
            <li><a href="#">Cancellations & Return</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>

        {/* CONTACT & SOCIAL MEDIA */}
        <div className="footer-section contact-section">
          <h3>MAIL US</h3>
          <p><a href="mailto:Aura@gmail.com">Aura@gmail.com</a></p>
          <h3>KEEP IN TOUCH</h3>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>
        <div className="footer-section contact-section">
          <h3>CONTACT US</h3>
          <p>+91 - 8032142621</p>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="footer-bottom">
        <div className="bottom-links">
          <a href="#">Become a Seller</a>
          <a href="#">Gift Cards</a>
          <a href="#">Help Center</a>
        </div>
        <p>© 2007 - 2025 Aura.com</p>
        <div className="payment-icons">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" />
          <img src={dicovercard_icon} alt="Discover Logo" />

        </div>
      </div>
    </footer>
  );
};

export default Footer;
