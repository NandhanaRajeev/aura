

import { pool } from '../config/db.js';  // Adjust path if needed

// controllers/feedbackController.js
export const submitFeedback = async (req, res) => {
  const { name, email, rating, comments } = req.body;

  try {
    // Step 1: Get the user ID from the users table using the email
    const [userResult] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const user_id = userResult[0].id;

    // Step 2: Insert feedback with the user_id
    const sql = `INSERT INTO feedback (user_id, name, email, rating, comments) VALUES (?, ?, ?, ?, ?)`;
    await pool.query(sql, [user_id, name, email, rating, comments]);

    res.status(200).json({ message: "✅ Feedback submitted successfully!" });

  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({ error: "Feedback submission failed" });
  }
};

// controllers/feedbackController.js
export const getAllFeedback = async (req, res) => {
  try {
    const [feedback] = await pool.query('SELECT name, rating, comments FROM feedback ORDER BY fed_id DESC');
    res.status(200).json(feedback);
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};
