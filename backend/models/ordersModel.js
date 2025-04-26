import { pool } from '../config/db.js';

// Create a new order
export const createOrder = async (orderData) => {
    const { user_id, product_id, quantity, size, total_price, status } = orderData;
    const [result] = await pool.query(
        `INSERT INTO orders (user_id, product_id, quantity, size, total_price, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, product_id, quantity, size, total_price, status || 'Pending']
    );
    return result.insertId;
};

// Get all orders
export const getAllOrders = async () => {
    const [rows] = await pool.query(`SELECT * FROM orders`);
    return rows;
};

// Get orders by user ID
export const getOrdersByUserId = async (user_id) => {
    const [rows] = await pool.query(`SELECT * FROM orders WHERE user_id = ?`, [user_id]);
    return rows;
};

// Update order status
export const updateOrderStatus = async (order_id, status) => {
    const [result] = await pool.query(`UPDATE orders SET status = ? WHERE order_id = ?`, [status, order_id]);
    return result.affectedRows;
};

// Delete order
export const deleteOrder = async (order_id) => {
    const [result] = await pool.query(`DELETE FROM orders WHERE order_id = ?`, [order_id]);
    return result.affectedRows;
};
