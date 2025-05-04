import React, { useEffect, useState } from "react";
import "./LatestCollection.css";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products/latest");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>LATEST COLLECTION</h1>
      <div className="latest-container">
        {products.length > 0 ? (
          products.map((product) => {
            const validProductId = product.id || product.title?.replace(/\s+/g, "-").toLowerCase();

            return (
              <div key={validProductId} className="latest-card">
                <Link
                  to={`/product/${validProductId}`}
                  state={{ product }}
                  className="image-container"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="latest-image"
                  />
                </Link>
                <h3 className="latest-title">{product.title}</h3>
                <div className="price-container">
                  <span className="latest-price">${product.new_price}</span>
                  <span className="original-price">${product.prev_price}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default LatestCollection;
