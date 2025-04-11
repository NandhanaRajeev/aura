import { pool } from "../config/db.js";

export const getUserCart = async (userId) => {
    const [rows] = await pool.query(
        "SELECT * FROM cart WHERE user_id = ?",
        [userId]
    );
    return rows;
};

export const removeFromCart = async (userId, productId) => {
    await pool.query(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, productId]
    );
};

export const updateQuantity = async (userId, productId, newQuantity) => {
    await pool.query(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQuantity, userId, productId]
    );
};
