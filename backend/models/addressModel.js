import { pool } from "../config/db.js";

// Insert a new address
export const insertAddress = async ({ fullName, mobile, address, pincode }) => {
  const sql = `INSERT INTO users_details (fullName, mobile, address, pincode)
               VALUES (?, ?, ?, ?)`;

  const [result] = await pool.query(sql, [fullName, mobile, address, pincode]);
  return result.insertId;
};

// Get addresses by user (if you later link to user_id)
export const getAddressesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM users_details WHERE user_id = ?`,
    [userId]
  );
  return rows;
};

// Delete address by ID
export const deleteAddress = async (id) => {
  const [result] = await pool.query(`DELETE FROM users_details WHERE id = ?`, [id]);
  return result.affectedRows;
};

// Update address by ID
export const updateAddress = async (id, updatedData) => {
  const { fullName, mobile, address, pincode } = updatedData;
  const [result] = await pool.query(
    `UPDATE users_details SET fullName = ?, mobile = ?, address = ?, pincode = ? WHERE id = ?`,
    [fullName, mobile, address, pincode, id]
  );
  return result.affectedRows;
};
