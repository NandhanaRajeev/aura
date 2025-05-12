import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesMain.css";
import SERVER_URL from "../../../config";

function CategoriesMain({ categoryName }) {
  const navigate = useNavigate();
  const [discountedBrands, setDiscountedBrands] = useState([]);

  useEffect(() => {
    const fetchDiscountedBrands = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/products/discounted`);
        const data = await response.json();

        // Debug log
        console.log("Fetched discounted brands:", data);

        // Ensure the response is an array
        if (Array.isArray(data)) {
          setDiscountedBrands(data);
        } else {
          console.warn("Expected an array but got:", typeof data);
          setDiscountedBrands([]);
        }
      } catch (error) {
        console.error("Error fetching discounted brands:", error);
      }
    };

    fetchDiscountedBrands();
  }, []);

  const handleCategoryClick = () => {
    navigate(`/filters?category=${encodeURIComponent(categoryName)}`);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="categories-main">
      <h2 onClick={handleCategoryClick} style={{ cursor: "pointer" }}>
        {categoryName}
      </h2>

      <div className="product-list">
        {Array.isArray(discountedBrands) && discountedBrands.length > 0 ? (
          discountedBrands.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
              style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", margin: "10px" }}
            >
              <img src={product.image} alt={product.name} style={{ maxWidth: "100px" }} />
              <h4>{product.name}</h4>
              <p>Price: ${product.price}</p>
            </div>
          ))
        ) : (
          <p>No discounted products found.</p>
        )}
      </div>
    </div>
  );
}

export default CategoriesMain;
