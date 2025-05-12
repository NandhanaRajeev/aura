import express from "express";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate and extract user ID from token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user.id will be accessible now
    next();
  });
};

// POST /api/wishlist/add - Add product to wishlist and cart
router.post("/add", authenticateToken, async (req, res) => {
  const { product_id } = req.body;

  try {
    // Check if the item already exists in the wishlist
    const [existingWishlist] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );

    if (existingWishlist.length > 0) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    // Add item to wishlist
    const [result] = await pool.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [req.user.id, product_id]
    );
    console.log("Item added to wishlist:", result);

    // Optional: Add to cart as well (if needed)
    // await pool.query(
    //   "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    //   [req.user.id, product_id, 1]
    // );

    // Fetch updated wishlist and send it in the response
    const [updatedWishlist] = await pool.query(
      `SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?`,
      [req.user.id]
    );

    res.json({ message: "Item added to wishlist", updatedWishlist });

  } catch (error) {
    console.error("Error adding to wishlist and cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/wishlist - Get wishlist for logged in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?`,
      [req.user.id]
    );
    console.log("Wishlist items fetched:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/wishlist/remove/:product_id - Remove product from wishlist
router.delete("/remove/:product_id", authenticateToken, async (req, res) => {
  const { product_id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Item not found in wishlist" });
    }

    // Fetch updated wishlist after deletion
    const [updatedWishlist] = await pool.query(
      `SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?`,
      [req.user.id]
    );

    res.json({ message: "Item removed from wishlist", updatedWishlist });

  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
