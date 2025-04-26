import { pool } from "../config/db.js";

// Function to insert UPI details
export const insertUpi = async (userId, upiId, rememberUpi) => {
    const query = `INSERT INTO upi (user_id, upi_id, remember_upi) 
                   VALUES (?, ?, ?) 
                   ON DUPLICATE KEY UPDATE upi_id = ?, remember_upi = ?`;
    const values = [userId, upiId, rememberUpi, upiId, rememberUpi];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Error inserting/updating UPI ID:", error);
        throw error;
    }
};

// Function to fetch UPI details for a user
export const getUpiByUserId = async (userId) => {
    const query = "SELECT * FROM upi WHERE user_id = ?";
    
    try {
        const [rows] = await pool.query(query, [userId]);
        return rows.length ? rows[0] : null; // Return the first UPI record or null if not found
    } catch (error) {
        console.error("Error fetching UPI for user:", error);
        throw error;
    }
};
