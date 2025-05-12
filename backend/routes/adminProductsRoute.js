// routes/adminProducts.js

import express from 'express';
const router = express.Router();
import { pool } from '../config/db.js';  // Ensure you have db.js set up with MySQL connection

// GET all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST a new product
router.post("/", async (req, res) => {
  const { img, title, star, reviews, prev_price, new_price, company, color, category } = req.body;
  try {
    await pool.query(
      "INSERT INTO products (img, title, star, reviews, prev_price, new_price, company, color, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [img, title, star, reviews, prev_price, new_price, company, color, category]
    );
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT update a product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { img, title, star, reviews, prev_price, new_price, company, color, category } = req.body;
  try {
    await pool.query(
      "UPDATE products SET img=?, title=?, star=?, reviews=?, prev_price=?, new_price=?, company=?, color=?, category=? WHERE id=?",
      [img, title, star, reviews, prev_price, new_price, company, color, category, id]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
router.get('/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Error fetching product count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
