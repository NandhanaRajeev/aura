// adminFeedbackRoute.js (converted)
import express from "express";
import { pool } from "../config/db.js"; // Assuming you use pool elsewhere

const router = express.Router();

// GET all feedback
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM feedback");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});
router.get('/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM feedback');
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching feedback count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE feedback by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM feedback WHERE fed_id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

export default router;
