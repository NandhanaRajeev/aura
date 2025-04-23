import { pool } from '../config/db.js';  // Adjust path if needed

// controllers/feedbackController.js
export const submitFeedback = async (req, res) => {
    const { name, email, rating, comments } = req.body;
  
    try {
      // Insert the feedback into the database (adjust as needed)
      const sql = `INSERT INTO feedback (name, email, rating, comments) VALUES (?, ?, ?, ?)`;
      await pool.query(sql, [name, email, rating, comments]);
  
      res.status(200).json({ message: "Feedback submitted successfully!" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Feedback submission failed" });
    }
  };
  

