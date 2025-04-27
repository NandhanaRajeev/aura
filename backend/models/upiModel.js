import { pool } from "../config/db.js";

// Function to insert UPI details
export const insertUpi = async (userId, upiId, rememberUpi) => {
    try {
        // Check if the UPI ID already exists for the user
        const [existingRows] = await pool.query(
            'SELECT upi_id FROM upi WHERE user_id = ? AND upi_id = ?',
            [userId, upiId]
        );

        // If UPI ID already exists, skip insertion
        if (existingRows.length > 0) {
            console.log(`UPI ID ${upiId} already exists for user ${userId}, skipping insertion.`);
            return;
        }

        // Insert new UPI ID if it doesn't exist
        const query = `INSERT INTO upi (user_id, upi_id, remember_upi) VALUES (?, ?, ?)`;
        const values = [userId, upiId, rememberUpi];
        
        await pool.query(query, values);
        console.log(`UPI ID ${upiId} inserted successfully for user ${userId}.`);
    } catch (error) {
        console.error("Error inserting/updating UPI ID:", error);
        throw error;
    }
};

// Function to fetch UPI details for a user
export const getUpiByUserId = async (userId) => {
    const query = "SELECT * FROM upi WHERE user_id = ? AND remember_upi = 1";
    
    try {
        const [rows] = await pool.query(query, [userId]);
        return rows.length ? rows : []; // Return all UPI records or an empty array if none
    } catch (error) {
        console.error("Error fetching UPI for user:", error);
        throw error;
    }
};