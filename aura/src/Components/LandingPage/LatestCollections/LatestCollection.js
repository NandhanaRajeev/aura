import React from "react";
import "./LatestCollection.css";
import imag1 from "../../Assets/latest1.png";
import imag2 from "../../Assets/latest2.png";
import imag3 from "../../Assets/latest3.png";
import imag4 from "../../Assets/latest4.png";
import imag5 from "../../Assets/latest5.png";
import imag6 from "../../Assets/latest6.png";
import imag7 from "../../Assets/latest7.png";
import imag8 from "../../Assets/latest8.png";

const products = [
  {
    id: 1,
    image: imag1, 
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$50",
    originalPrice: "$80.5",
  },
  {
    id: 2,
    image: imag2,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    price: "$85",
    originalPrice: "$120.5",
  },
  {
    id: 3,
    image: imag3,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    price: "$60",
    originalPrice: "$100.5",
  },
  {
    id: 4,
    image: imag4,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$100",
    originalPrice: "$150",
  },
  {
    id: 5,
    image: imag5, 
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$50",
    originalPrice: "$80.5",
  },
  {
    id: 6,
    image: imag6,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    price: "$85",
    originalPrice: "$120.5",
  },
  {
    id: 7,
    image: imag7,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    price: "$60",
    originalPrice: "$100.5",
  },
  {
    id: 8,
    image: imag8,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$100",
    originalPrice: "$150",
  },
];

const LatestCollection = () => {
    return (
      <>
      <h1><center>LATEST COLLECTION</center></h1>
      <div className="latest-container">
        
        {products.map((product) => (
          <div key={product.id} className="latest-card">
            <div className="image-container">
              
              <img src={product.image} alt={product.name} className="latest-image" />
              <div className="discount-badge">{product.discount}</div>
            </div>
            
            <h3 className="latest-title">{product.name}</h3>
            <div className="price-container">
              <span className="latest-price">{product.price}</span>
              <span className="original-price">{product.originalPrice}</span>
            </div>
          </div>
        ))}
      </div>
      </>
    );
  };

export default LatestCollection;
