import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesMain.css";

import img1 from "../../Assets/categories1.png";
import img2 from "../../Assets/categories2.png";
import img3 from "../../Assets/categories3.png";
import img4 from "../../Assets/categories4.png";

import brand1 from "../../Assets/brand1.png";
import brand2 from "../../Assets/brand2.png";
import brand3 from "../../Assets/brand3.png";
import brand4 from "../../Assets/brand4.png";
import brand5 from "../../Assets/brand5.png";
import brand6 from "../../Assets/brand6.png";
import brand7 from "../../Assets/brand7.png";
import brand8 from "../../Assets/brand8.png";

const brands = [
  { name: "MANGO", img: brand1 },
  { name: "ONLY", img: brand2 },
  { name: "Van Heusen", img: brand3 },
  { name: "H&M", img: brand4 },
  { name: "Zara", img: brand5 },
  { name: "Forever 21", img: brand6 },
  { name: "Levis", img: brand7 },
  { name: "Dealuxe", img: brand8 },
];

const categories = [
  { name: "Tops & T-Shirts", img: img1 },
  { name: "Dresses & Jumpsuits", img: img2 },
  { name: "Bottoms", img: img3 },
  { name: "Ethnic & Traditional Wear", img: img4 },
];

const CategoriesMain = () => {
  /*for filterpage*/
  const navigate = useNavigate(); // Initialize navigation

  // Function to handle click and navigate to Filter Page
  const handleCategoryClick = (categoryName) => {
    navigate(`/filters?category=${encodeURIComponent(categoryName)}`);
  };
  /*for filterpage*/
  return (
    <>
    <div className="brands-container">
        <h2>BIGGEST DEALS ON TOP BRANDS</h2>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-box">
              <img src={brand.img} alt={brand.name} className="brand-image" />
              <p className="brand-name">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="categories-container">
        <h2>CATEGORIES</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-box"
            onClick={() => handleCategoryClick(category.name)}
              style={{ cursor: "pointer" }} // Add pointer cursor
              >
              
              <img src={category.img} alt={category.name} />
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      
    </>
  );
};

export default CategoriesMain;
