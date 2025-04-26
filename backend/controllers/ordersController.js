import { pool } from '../config/db.js';

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    const { user_id, items, status, total_price } = req.body;

    if (!user_id || !Array.isArray(items) || !status || !total_price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO orders (user_id, items, status, total_price) VALUES (?, ?, ?, ?)',
            [user_id, JSON.stringify(items), status, total_price]
        );
        res.status(201).json({ message: 'Order placed successfully', order_id: result.insertId });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
