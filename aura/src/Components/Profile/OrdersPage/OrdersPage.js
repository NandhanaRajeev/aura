import React, { useEffect, useState } from "react";
import axios from "axios";
import './OrdersPage.css';
import SERVER_URL from "../../../config";

const OrdersPage = ({ user_id }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${SERVER_URL}/api/cart/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const placeOrder = async () => {
    try {
      // Your order placement logic goes here
      await axios.post(
        `${SERVER_URL}/api/orders/place`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Clear the cart after the order is placed
      await clearCart();
      // Fetch the updated orders after placing the order and clearing the cart
      fetchOrders();  // This triggers the re-fetch and page update
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const updateQuantity = async (productId, quantity, size) => {
    try {
      if (quantity < 1) return;
      await axios.put(
        `${SERVER_URL}/api/orders/update`,
        { productId, quantity, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();  // Refresh the orders list after updating quantity
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No items in your orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.order_id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>{order.title || order.product_name}</strong> (Size: {order.size})</p>
              <p>
                Quantity:{" "}
                <input
                  type="number"
                  value={order.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQuantity(order.product_id, parseInt(e.target.value), order.size)
                  }
                />
              </p>
              <p>Total: ₹{order.total_price}</p>
              <p>Status: {order.status}</p>
              <p>Ordered At: {new Date(order.ordered_at).toLocaleString()}</p>
              {/* <button onClick={() => removeItem(order.product_id, order.size)}>Remove</button> */}
            </li>
          ))}
        </ul>
      )}
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default OrdersPage;
