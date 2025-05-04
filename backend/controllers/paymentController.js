import { pool } from "../config/db.js";

export const finalizeOrderController = async (req, res) => {
    const userId = req.user.id;

    try {
        const [cartItems] = await pool.query(
            `SELECT product_id, quantity, size FROM cart WHERE user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Insert each cart item into orders
        for (const item of cartItems) {
            const [productDetails] = await pool.query(
                `SELECT new_price FROM products WHERE id = ?`,
                [item.product_id]
            );

            const price = productDetails[0]?.new_price || 0;
            const total_price = price * item.quantity;

            await pool.query(
                `INSERT INTO orders (user_id, product_id, quantity, size, total_price, status, ordered_at)
                 VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
                [userId, item.product_id, item.quantity, item.size, total_price]
            );
        }

        // Clear the cart after ordering
        await pool.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);

        res.status(200).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("Error finalizing order:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
};
