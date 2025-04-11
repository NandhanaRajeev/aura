import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const router = express.Router();

// 🔐 Helper to extract user ID from JWT
const verifyTokenAndGetUserId = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "No token provided" });
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // user ID
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
        return null;
    }
};

// ➕ Add item to cart
router.post("/add", async (req, res) => {
    const user_id = verifyTokenAndGetUserId(req, res);
    if (!user_id) return;

    const { product_id, quantity, size } = req.body;

    try {
        const sql = `
            INSERT INTO cart (user_id, product_id, quantity, size)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(sql, [user_id, product_id, quantity, size]);
        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
});

// 🛒 View user's cart
router.get("/", async (req, res) => {
    const user_id = verifyTokenAndGetUserId(req, res);
    if (!user_id) return;

    try {
        const [rows] = await pool.query(
            `SELECT c.id, p.title, p.image, p.new_price, c.quantity, c.size
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [user_id]
        );
        res.json(rows);
    } catch (err) {
        console.error("Fetch cart error:", err);
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
});

export default router;
