// src/models/userModel.js
import { pool } from "../config/db.js";

export const createUser = async (name, email, hashedPassword) => {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, hashedPassword];
  await pool.query(query, values);
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

export const updateUser = async (id, name, phone, email, gender, dob, address) => {
  const query = `
    UPDATE users 
    SET name = ?, phone = ?, email = ?, gender = ?, dob = ?, address = ? 
    WHERE id = ?
  `;
  const values = [name, phone, email, gender, dob, address, id];
  await pool.query(query, values);

  // Return the updated user
  return findUserById(id);  // Or just return a success message
};
