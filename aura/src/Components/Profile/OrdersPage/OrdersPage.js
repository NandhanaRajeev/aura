import React, { useState, useEffect } from "react";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this with actual user ID from auth context or localStorage
  const userId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancel = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to cancel order");

      setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
    } catch (err) {
      alert("Could not cancel order. Try again.");
      console.error(err);
    }
  };

  const handleView = (order) => {
    alert(`Viewing order #${order.order_id}`);
    // You can replace this with modal or navigation to detail page
  };

  return (
    <div className="orders-page">
      <div className="orders-content">
        <h2>Your Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">No orders placed yet.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.order_id} className="order-item">
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Product ID:</strong> {order.product_id}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Size:</strong> {order.size}</p>
                <p><strong>Total Price:</strong> ${order.total_price}</p>
                <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                <p><strong>Ordered At:</strong> {new Date(order.ordered_at).toLocaleDateString()}</p>

                <div className="order-buttons">
                  <button className="view-btn" onClick={() => handleView(order)}>View</button>
                  <button className="cancel-btn" onClick={() => handleCancel(order.order_id)}>Cancel</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
