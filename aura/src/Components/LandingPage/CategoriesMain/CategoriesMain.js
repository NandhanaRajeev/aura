import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesMain.css";
import SERVER_URL from "../../../config";

import img1 from "../../Assets/categories1.png";
import img2 from "../../Assets/categories2.png";
import img3 from "../../Assets/categories3.png";
import img4 from "../../Assets/categories4.png";

const categories = [
  { name: "Tops & T-Shirts", img: img1 },
  { name: "Dresses & Jumpsuits", img: img2 },
  { name: "Bottoms", img: img3 },
  { name: "Ethnic & Traditional Wear", img: img4 },
];

const CategoriesMain = () => {
  const navigate = useNavigate();
  const [discountedBrands, setDiscountedBrands] = useState([]);

  useEffect(() => {
    const fetchDiscountedBrands = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/products/discounted`);
        const data = await response.json();
        console.log("Fetched discounted brands:", data);
        setDiscountedBrands(data);
      } catch (error) {
        console.error("Error fetching discounted brands:", error);
      }
    };

    fetchDiscountedBrands();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/filters?category=${encodeURIComponent(categoryName)}`);
  };

  // Navigate to the product page and pass the full product data via state
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <>
      <div className="brands-container">
        <h2>
          <center>
            <strong>BIGGEST DEALS ON TOP BRANDS</strong>
          </center>
        </h2>
        <div className="brands-grid">
          {discountedBrands.map((brand, index) => {
            const validProductId = brand.id || brand.title?.replace(/\s+/g, "-").toLowerCase();

            return (
              <div
                key={validProductId}
                className="brand-box"
                onClick={() => handleProductClick(brand)} // Pass full product data here
                style={{ cursor: "pointer" }}
              >
                <img src={brand.img} alt={brand.title} className="brand-image" />
                <p className="brand-name">{brand.company}</p>
                <p style={{ color: "green" }}>
                  ₹{brand.new_price} <s style={{ color: "gray" }}>₹{brand.prev_price}</s>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="categories-container">
        <h2>
          <center>
            <strong>CATEGORIES</strong>
          </center>
        </h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-box"
              onClick={() => handleCategoryClick(category.name)}
              style={{ cursor: "pointer" }}
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