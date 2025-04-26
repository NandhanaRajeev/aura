import { pool } from "../config/db.js";

export const getUserCart = async (userId) => {
    const [rows] = await pool.query(
        "SELECT * FROM cart WHERE user_id = ?",
        [userId]
    );
    return rows;
};

export const removeFromCart = async (userId, productId, size) => {
    const [result] = await pool.query(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ? AND size = ?",
        [userId, productId, size]
    );
    return result.affectedRows; // Return number of rows deleted
};

export const updateQuantity = async (userId, productId, newQuantity, size) => {
    const [result] = await pool.query(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?",
        [newQuantity, userId, productId, size]
    );
    return result.affectedRows;
};