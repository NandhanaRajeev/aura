import React from "react";
import { BsFillHeartFill, BsFillBagFill } from "react-icons/bs";
import { useCart } from "../LandingPage/CartPage/CartContext";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const Card = ({ id, img, title, star, reviews, prevPrice, newPrice }) => {
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-icon" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-icon" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="star-icon" />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    const item = {
      id,
      image: img,
      title,
      star,
      reviews,
      prevPrice,
      price: newPrice,
      size: "M",
    };
    addToCart(item);
  };

  return (
    <section className="card">
      <Link
        to={`/product/${id}`}
        state={{ product: { id, img, title, star, reviews, prevPrice, newPrice } }}
      >
        <img src={img} alt={title} className="card-img" />
      </Link>


      <div className="card-details">
        <h3 className="card-title">{title}</h3>
        <section className="card-reviews">
            <div className="stars">{renderStars(star)}</div>
            <span className="total-reviews"> {reviews}</span>
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