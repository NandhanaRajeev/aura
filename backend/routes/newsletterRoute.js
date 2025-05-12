import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/total-subscribers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) AS total FROM newsletter_subscribers');
        res.json({ totalSubscribers: rows[0].total });
    } catch (error) {
        console.error('Error fetching total subscribers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/subscribe', async (req, res) => {
  const { email, userId } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID is required for the subscription." });
  }

  try {
    const sql = "INSERT INTO newsletter_subscribers (email, user_id) VALUES (?, ?)";
    await pool.query(sql, [email, userId]);
    res.status(200).json({ message: "Thank you for subscribing!" });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ error: "Subscription failed." });
  }
});

export default router;
