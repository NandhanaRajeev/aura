import express from "express";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Get cart items for the logged-in user with product details
router.get("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const userId = decoded.id;

        const [cartItems] = await pool.query(
            `SELECT c.product_id, c.quantity, c.size, 
                    p.title, p.img, p.new_price AS price, p.prev_price, p.star, p.reviews
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );

        res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

// Other cart routes (add, update, remove) remain unchanged
router.post("/add", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const userId = decoded.id;
        const { product_id, quantity, size } = req.body;

        const [existing] = await pool.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?",
            [userId, product_id, size]
        );

        if (existing.length > 0) {
            await pool.query(
                "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ?",
                [quantity, userId, product_id, size]
            );
        } else {
            await pool.query(
                "INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)",
                [userId, product_id, quantity, size]
            );
        }

        res.status(200).json({ message: "Item added to cart successfully!" });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
});

router.put("/update", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const userId = decoded.id;
        const { productId, quantity, size } = req.body;

        await pool.query(
            "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?",
            [quantity, userId, productId, size]
        );

        res.status(200).json({ message: "Cart updated successfully!" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Failed to update cart" });
    }
});

router.delete("/remove/:userId/:productId", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        const userId = decoded.id;
        const { productId } = req.params;

        await pool.query(
            "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        res.status(200).json({ message: "Item removed from cart successfully!" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
});

export default router;