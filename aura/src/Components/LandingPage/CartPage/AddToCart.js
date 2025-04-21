import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddToCart.css";
import CartContext from "./CartContext";

const AddToCart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [localCartItems, setLocalCartItems] = useState(cartItems);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalCartItems(cartItems);
  }, [cartItems]);

  const handleQuantityChange = async (productId, newQuantity, size) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:3000/api/cart/update",
        {
          userId,
          productId,
          quantity: newQuantity,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Cart updated successfully!") {
        const updatedItems = localCartItems.map((item) =>
          item.product_id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
        setLocalCartItems(updatedItems);
        setCartItems(updatedItems);
      } else {
        console.error("Failed to update cart.");
      }
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

  return (
    <div className="cart-container">
      <h2>🛍️ Your Cart</h2>
      {localCartItems && localCartItems.length > 0 ? (
        <>
          {localCartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.title} />
              <div className="item-details">
                <h4>{item.title}</h4>
                <p>Price (each): ₹{item.price}</p>
                <p>Total: ₹{item.price * item.quantity}</p>
                <p>Size: {item.size}</p>
                <label>
                  Quantity:{" "}
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product_id,
                        parseInt(e.target.value),
                        item.size
                      )
                    }
                  >
                    {[1, 2, 3, 4, 5].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </label>
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
