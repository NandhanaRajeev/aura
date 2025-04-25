import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import "./AddToCart.css";
import { CartContext } from "./CartContext";
import { LoginContext } from "../../LoginContext"; 
import { jwtDecode } from "jwt-decode";

const AddToCart = () => {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const { isLoggedIn } = useContext(LoginContext); 
    const [localCartItems, setLocalCartItems] = useState(cartItems);
    const [isLoading, setIsLoading] = useState(null); 
    const navigate = useNavigate();

    const getUserId = () => {
        const token = localStorage.getItem("token");
        if (!token || !isLoggedIn) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.id;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    useEffect(() => {
        setLocalCartItems(cartItems);
    }, [cartItems]);

    const handleQuantityChange = async (productId, newQuantity, size) => {
        if (newQuantity < 1) return;
        const userId = getUserId();
        if (!userId) {
            alert("Please log in to update cart.");
            return;
        }

        const operationKey = `${productId}-${size}-quantity`;
        setIsLoading(operationKey);
        try {
            await updateQuantity(productId, size, newQuantity);
            const updatedItems = localCartItems.map((item) =>
                item.product_id === productId && item.size === size
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setLocalCartItems(updatedItems);
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert(error.message || "Failed to update quantity.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleRemove = async (productId, size) => {
        if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;
        const userId = getUserId();
        if (!userId) {
            alert("Please log in to remove items from cart.");
            return;
        }

        const operationKey = `${productId}-${size}-remove`;
        setIsLoading(operationKey);
        const originalItems = [...localCartItems];
        const updatedItems = localCartItems.filter(
            (item) => item.product_id !== productId || item.size !== size
        );
        setLocalCartItems(updatedItems); 
        try {
            await removeFromCart(productId, size);
            alert("Item removed from cart successfully!");
        } catch (error) {
            console.error("Error removing item from cart:", error);
            setLocalCartItems(originalItems); 
            alert(error.message || "Failed to remove item from cart.");
        } finally {
            setIsLoading(null);
        }
    };

    const handleProceedToPay = () => {
        navigate("/payment");
    };

    const getTotalAmount = () => {
        return localCartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const decreaseQuantity = (productId, currentQuantity, size) => {
        if (currentQuantity > 1) {
            handleQuantityChange(productId, currentQuantity - 1, size);
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">🛍️ Your Cart</h2>
            {localCartItems && localCartItems.length > 0 ? (
                <>
                    {localCartItems.map((item, index) => (
                        <div className="cart-item" key={`${item.product_id}-${item.size}-${index}`}>
                            <div className="cart-item-image">
                                <img src={item.img} alt={item.title} />
                            </div>
                            <div className="item-details">
                                <h4 className="item-title">{item.title}</h4>
                                <p className="item-price">Price: ₹{item.price}</p>
                                <p className="item-total">Total: ₹{item.price * item.quantity}</p>
                                <p className="item-size">Size: {item.size}</p>
                                <div className="quantity-container">
                                    <button
                                        className="quantity-btn decrease"
                                        onClick={() =>
                                            decreaseQuantity(item.product_id, item.quantity, item.size)
                                        }
                                        disabled={isLoading === `${item.product_id}-${item.size}-quantity`}
                                    >
                                        -
                                    </button>
                                    <select
                                        className="quantity-select"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                item.product_id,
                                                parseInt(e.target.value),
                                                item.size
                                            )
                                        }
                                        disabled={isLoading === `${item.product_id}-${item.size}-quantity`}
                                    >
                                        {[1, 2, 3, 4, 5].map((qty) => (
                                            <option key={qty} value={qty}>
                                                {qty}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="quantity-btn increase"
                                        onClick={() =>
                                            handleQuantityChange(item.product_id, item.quantity + 1, item.size)
                                        }
                                        disabled={isLoading === `${item.product_id}-${item.size}-quantity`}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleRemove(item.product_id, item.size)}
                                        title="Remove item"
                                        disabled={isLoading === `${item.product_id}-${item.size}-remove`}
                                    >
                                        <BsTrash className="delete-icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="cart-total">
                        <h3>Grand Total: ₹{getTotalAmount()}</h3>
                    </div>

                    <div className="proceed-to-pay-container">
                        <button className="proceed-to-pay-btn" onClick={handleProceedToPay}>
                            Checkout 💳
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-cart-message">
                    <h3>😔 Your bag is empty!</h3>
                    <p>Looks like you haven’t added anything yet. Let’s fix that!</p>
                    <a className="shop-now-btn" href="/women">
                        🛒 Shop Now
                    </a>
                </div>
            )}
        </div>
    );
};

export default AddToCart;
