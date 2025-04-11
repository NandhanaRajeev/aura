import React from "react";
import { BsFillHeartFill, BsFillBagFill } from "react-icons/bs";
import { useCart } from "../LandingPage/CartPage/CartContext"; // use the custom hook

const Card = ({ img, title, star, reviews, prevPrice, newPrice }) => {
  const { addToCart } = useCart(); // use the custom hook

  const handleAddToCart = () => {
    const item = {
      image: img,
      title,
      star,
      reviews,
      prevPrice,
      price: newPrice,
      size: "M", // You can change this based on logic or user selection
    };
    addToCart(item);
  };

  return (
    <section className="card">
      <img src={img} alt={title} className="card-img" />
      <div className="card-details">
        <h3 className="card-title">{title}</h3>
        <section className="card-reviews">
          {star} {star} {star} {star}
          <span className="total-reviews">{reviews}</span>
        </section>
        <section className="card-price">
          <div className="price">
            <del>{prevPrice}</del> {newPrice}
          </div>
          <div className="icon-container">
            <div className="wishlist">
              <BsFillHeartFill className="wishlist-icon" />
            </div>
            <div className="bag" onClick={handleAddToCart}>
              <BsFillBagFill className="bag-icon" />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Card;
