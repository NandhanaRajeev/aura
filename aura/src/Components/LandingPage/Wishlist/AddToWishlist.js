import React, { useContext, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { WishlistContext } from "./WishlistContext";
import { CartContext } from "../CartPage/CartContext";
import "./AddToWishlist.css";

const AddToWishlist = () => {
    const { wishlistItems, addToWishlist, removeFromWishlist, error, success } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(null);

    const handleRemove = async (productId) => {
        if (!window.confirm("Remove this item from your wishlist?")) return;

        setIsLoading(productId);
        try {
            const success = await removeFromWishlist(productId);
            if (success) {
                alert("Item removed from wishlist!");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert("Failed to remove.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleAddToCart = async (item) => {
        if (!item?.product_id) {
            console.error("Missing product_id:", item);
            alert("Failed to add to cart.");
            return;
        }

        const cartItem = {
            id: item.product_id,
            title: item.title,
            image: item.image,
            price: item.price,
            prevPrice: item.prev_price,
            star: item.star,
            reviews: item.reviews,
        };

        setIsLoading(item.product_id);
        try {
            await addToCart(cartItem);
            alert("Item added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleAddToWishlist = async (item) => {
        setIsLoading(item.product_id);
        try {
            await addToWishlist(item);
            alert("Item added to wishlist!");
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            alert("Failed to add to wishlist.");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="wishlist-container">
            <h2 className="wishlist-title">✨ Your Wishlist</h2>
            {error && <p className="error" style={{ color: "red", textAlign: "center" }}>{error}</p>}
            {success && <p className="success" style={{ color: "green", textAlign: "center" }}>{success}</p>}
            {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                    <div className="wishlist-item" key={item.product_id}>
                        <div className="wishlist-item-image">
                            <img src={item.image} alt={item.title} />
                        </div>
                        <div className="item-details">
                            <h4 className="item-title">{item.title}</h4>
                            <p className="item-price">Price: ₹{item.price}</p>
                            <button
                                className="add-to-cart-btn"
                                onClick={() => handleAddToCart(item)}
                                disabled={isLoading === item.product_id}
                            >
                                Add to Cart
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleRemove(item.product_id)}
                                disabled={isLoading === item.product_id}
                                title="Remove from wishlist"
                            >
                                <BsTrash className="delete-icon" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-wishlist-message">
                    <h3>😔 Your wishlist is empty!</h3>
                    <p>Looks like you haven’t added anything yet.</p>
                    <Link className="shop-now-btn" to="/women">🛒 Shop Now</Link>
                </div>
            )}
        </div>
    );
};

export default AddToWishlist;
