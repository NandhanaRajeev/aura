import { pool } from "../config/db.js";

export const createUser = async (name, email, hashedPassword) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await pool.query(sql, [name, email, hashedPassword]);
};

export const findUserByEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
};
