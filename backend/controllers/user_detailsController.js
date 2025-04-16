import { pool } from '../config/db.js';

export const createUserDetails = async (req, res) => {
  const { fullName, mobile, email, gender, dob, address } = req.body;

  try {
    const query = `
      INSERT INTO user_details (full_name, mobile, email, gender, dob, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [fullName, mobile, email, gender, dob, address];
    await pool.query(query, values);

    res.status(201).json({ message: 'User details saved successfully' });
  } catch (error) {
    console.error('Error saving user details:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
