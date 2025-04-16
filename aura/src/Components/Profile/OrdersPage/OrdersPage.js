import React, { useState, useEffect } from "react";
import "./OrdersPage.css"; 

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders([]); // Placeholder for API fetch
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-content">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders placed yet.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <p>Order ID: {order.id}</p>
                <p>Item: {order.itemName}</p>
                <p>Status: {order.status}</p>
                <div className="order-buttons">
                  <button className="view-btn">View</button>
                  <button className="cancel-btn">Cancel</button>
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
