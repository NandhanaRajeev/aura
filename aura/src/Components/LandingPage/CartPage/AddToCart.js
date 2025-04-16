import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./AddToCart.css";
import CartContext from "./CartContext";

const AddToCart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const [localCartItems, setLocalCartItems] = useState(cartItems);

  useEffect(() => {
    setLocalCartItems(cartItems);  // Sync local state with cartItems from context
  }, [cartItems]);

  // Handle Quantity Change
  const handleQuantityChange = async (productId, newQuantity, size) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      // Update quantity in backend
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

      // Debug response
      console.log("API Response:", response.data);

      if (response.data.message === "Cart updated successfully!") {
        // If the backend update is successful, update the cart in state
        const updatedItems = localCartItems.map((item) =>
          item.product_id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
        setLocalCartItems(updatedItems);  // Update local cart state
        setCartItems(updatedItems);  // Update global context state
      } else {
        console.error("Failed to update cart.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="cart-container">
      <h2>🛍️ Your Cart</h2>
      {localCartItems && localCartItems.length > 0 ? (
        localCartItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h4>{item.title}</h4>
              <p>Price: ₹{item.price}</p>
              <p>Size: {item.size}</p>
              <label>
                Quantity:{" "}
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product_id, parseInt(e.target.value), item.size)
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
        ))
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
