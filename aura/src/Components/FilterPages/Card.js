import React, { useContext } from "react";
import { BsFillHeartFill, BsFillBagFill } from "react-icons/bs";
import { useCart } from "../LandingPage/CartPage/CartContext";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { LoginContext } from "../LoginContext";

const Card = ({ id, img, title, star, reviews, prevPrice, newPrice }) => {
    const { addToCart } = useCart();
    const { isLoggedIn } = useContext(LoginContext);

    const fallbackId = title ? title.replace(/\s+/g, "-").toLowerCase() : "product";

    const validProductId = id || fallbackId;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="star-icon" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star-icon" />);
        }

        while (stars.length < 5) {
            stars.push(<FaRegStar key={`empty-${stars.length}`} className="star-icon" />);
        }

        return stars;
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!isLoggedIn || !token) {
            alert("Please log in to add items to your cart.");
            return;
        }

        if (!id) {
            console.warn("Missing actual product ID, using fallback for display only.");
        }

        const product = {
            id: validProductId,
            img,
            title,
            star,
            reviews,
            prev_price: prevPrice,
            new_price: newPrice,
        };

        const item = {
            id: product.id,
            image: product.img,
            title: product.title,
            star: product.star,
            reviews: product.reviews,
            prevPrice: product.prev_price,
            price: product.new_price,
            size: "M",
        };

        try {
            await addToCart(item);
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding item to cart:", error.message);
            alert(error.message || "Failed to add item to cart. Please try again.");
        }
    };

    return (
        <section className="card">
            <Link
                to={`/product/${validProductId}`}
                state={{
                    product: {
                        id: validProductId,
                        img,
                        title,
                        star,
                        reviews,
                        prevPrice,
                        newPrice,
                    },
                }}
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
