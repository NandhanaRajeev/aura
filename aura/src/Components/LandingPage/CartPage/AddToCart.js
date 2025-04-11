import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import "./AddToCart.css";

const AddToCart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  // 🔁 Handle Quantity Change
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/cart/update",
        {
          userId,
          productId,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems = cartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  return (
    <div className="cart-container">
      <h2>🛍️ Your Cart</h2>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item, index) => (
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
                    handleQuantityChange(item.product_id, parseInt(e.target.value))
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
