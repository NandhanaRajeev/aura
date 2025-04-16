import { pool } from '../config/db.js';

// Create user details
export const createUserDetails = async (full_name, mobile, email, gender, dob, address) => {
    const query = `
        INSERT INTO user_details (full_name, mobile, email, gender, dob, address)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [full_name, mobile, email, gender, dob, address];
    await pool.query(query, values);
};

// Get user details by email
export const getUserDetailsByEmail = async (email) => {
    const query = `SELECT * FROM user_details WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows[0]; // return single object or undefined
};

// Update user details by email
export const updateUserDetailsByEmail = async (email, updates) => {
    const { full_name, mobile, gender, dob, address } = updates;

    const query = `
        UPDATE user_details
        SET full_name = ?, mobile = ?, gender = ?, dob = ?, address = ?
        WHERE email = ?
    `;
    const values = [full_name, mobile, gender, dob, address, email];
    const [result] = await pool.query(query, values);
    return result;
};
