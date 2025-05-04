export const getUserOrders = async (userId) => {
    const [orders] = await pool.query(
        `SELECT o.*, p.title, p.img
         FROM orders o
         JOIN products p ON o.product_id = p.id
         WHERE o.user_id = ?
         ORDER BY o.ordered_at DESC`,
        [userId]
    );
    return orders;
};


// Add a new order
export const addOrder = async (userId, productId, quantity, size, total_price, status = "pending") => {
    const [result] = await pool.query(
        `INSERT INTO orders (user_id, product_id, quantity, size, total_price, status, ordered_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [userId, productId, quantity, size, total_price, status]
    );
    return result.insertId;
};

// Remove an order
export const removeOrder = async (userId, productId, size) => {
    const [result] = await pool.query(
        "DELETE FROM orders WHERE user_id = ? AND product_id = ? AND size = ?",
        [userId, productId, size]
    );
    return result.affectedRows;
};

// Update order quantity and total_price
export const updateOrder = async (userId, productId, quantity, size, total_price) => {
    const [result] = await pool.query(
        "UPDATE orders SET quantity = ?, total_price = ? WHERE user_id = ? AND product_id = ? AND size = ?",
        [quantity, total_price, userId, productId, size]
    );
    return result.affectedRows;
};
