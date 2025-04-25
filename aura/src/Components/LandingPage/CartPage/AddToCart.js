import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddToCart.css";
import { CartContext } from "./CartContext";

const AddToCart = () => {
    const { cartItems, updateQuantity } = useContext(CartContext);
    const [localCartItems, setLocalCartItems] = useState(cartItems);
    const navigate = useNavigate();

    useEffect(() => {
        setLocalCartItems(cartItems);
    }, [cartItems]);

    const handleQuantityChange = async (productId, newQuantity, size, title) => {
        try {
            await updateQuantity(title, size, newQuantity, productId);
            const updatedItems = localCartItems.map((item) =>
                item.product_id === productId && item.size === size
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setLocalCartItems(updatedItems);
        } catch (error) {
            console.error("Error updating quantity:", error);
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

    // Function to decrease quantity
    const decreaseQuantity = (productId, currentQuantity, size, title) => {
        if (currentQuantity > 1) {
            handleQuantityChange(productId, currentQuantity - 1, size, title);
        }
    };

    return (
        <div className="cart-container">
            <h2>🛍️ Your Cart</h2>
            {localCartItems && localCartItems.length > 0 ? (
                <>
                    {localCartItems.map((item, index) => (
                        <div className="cart-item" key={`${item.product_id}-${item.size}-${index}`}>
                            <img src={item.img} alt={item.title} />
                            <div className="item-details">
                                <h4>{item.title}</h4>
                                <p>Price (each): ₹{item.price}</p>
                                <p>Total: ₹{item.price * item.quantity}</p>
                                <p>Size: {item.size}</p>
                                <div className="quantity-container">
                                    <button
                                        className="quantity-btn"
                                        onClick={() =>
                                            decreaseQuantity(item.product_id, item.quantity, item.size, item.title)
                                        }
                                    >
                                        -
                                    </button>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                item.product_id,
                                                parseInt(e.target.value),
                                                item.size,
                                                item.title
                                            )
                                        }
                                    >
                                        {[1, 2, 3, 4, 5].map((qty) => (
                                            <option key={qty} value={qty}>
                                                {qty}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="quantity-btn"
                                        onClick={() =>
                                            handleQuantityChange(item.product_id, item.quantity + 1, item.size, item.title)
                                        }
                                    >
                                        +
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
