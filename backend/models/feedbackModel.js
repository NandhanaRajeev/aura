// models/feedbackModel.js

import { pool } from '../config/db.js';

export const createFeedback = async ({ user_id, name, email, rating, comments }) => {
  const sql = `
    INSERT INTO feedback (user_id, name, email, rating, comments) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [user_id || null, name, email, rating, comments];

  const [result] = await pool.query(sql, values);
  return result;
};
