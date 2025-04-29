import React from 'react';
import './AboutUs.css';
import { FaFeatherAlt } from 'react-icons/fa'; 

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Aura</h1>
        <p>Celebrating Confidence, Elegance, and You</p>
      </div>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Aura, we believe that fashion is more than just clothing — it's a form of self-expression.
          Our mission is to empower women by offering timeless styles, effortless elegance, and wardrobe
          essentials that speak to every mood and moment. We strive to create a shopping experience 
          that's as empowering as the women we dress.
        </p>
      </div>

      <div className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Contemporary collections curated for modern women</li>
          <li>High-quality, affordable fashion made with care</li>
          <li>Seamless online shopping with personalized recommendations</li>
          <li>Community-driven style inspiration and seasonal lookbooks</li>
          <li>Ethical production and a commitment to sustainable practices</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Our Vision</h2>
        <p>
          We envision a world where every woman feels confident and radiant in what she wears.
          Aura is dedicated to redefining everyday elegance — creating clothing that moves with you, 
          speaks for you, and celebrates every version of you.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
