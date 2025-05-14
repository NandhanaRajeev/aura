import React, { useContext } from "react";
import { BsFillHeartFill, BsFillBagFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { LoginContext } from "../LoginContext";
import { useCart } from "../LandingPage/CartPage/CartContext";

const Card = ({ id, img, title, star, reviews, prevPrice, newPrice, company }) => {
    const { isLoggedIn } = useContext(LoginContext);
    const { addToCart } = useCart(); // Use cart context

    const fallbackId = title ? title.replace(/\s+/g, "-").toLowerCase() : "product";
    const validProductId = id || fallbackId;

    // Debug: Log all props
    console.log("Card props:", { id, img, title, star, reviews, prevPrice, newPrice, company, validProductId });

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
        if (!isLoggedIn) {
            alert("Please log in to add items to your cart.");
            return;
        }

        if (!id || isNaN(id)) {
            console.error("Invalid product ID:", id);
            alert("Cannot add to cart: Invalid product ID. Please try another product.");
            return;
        }

        const cartItem = {
            id: parseInt(id), // Ensure numeric ID
            title,
            image: img,
            price: newPrice,
            prevPrice,
            star,
            reviews,
            quantity: 1,
            size: "M", // Default size, consider making dynamic
            company,
        };

        try {
            await addToCart(cartItem);
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error adding item to cart:", error.message);
            alert(error.message || "Failed to add item to cart. Please try again.");
        }
    };

    // Disable the add-to-cart button if id is invalid
    const isAddToCartDisabled = !id || isNaN(id);

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
                        company,
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
                        {/* <div className="wishlist">
                            <BsFillHeartFill className="wishlist-icon" />
                        </div> */}
                        <div
                            className={`bag ${isAddToCartDisabled ? "disabled" : ""}`}
                            onClick={isAddToCartDisabled ? null : handleAddToCart}
                            title={isAddToCartDisabled ? "Cannot add to cart: Invalid product" : "Add to cart"}
                        >
                            <BsFillBagFill className="bag-icon" />
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Card;