// routes/adminWishlist.js

import express from 'express';
const router = express.Router();
import { pool } from '../config/db.js';  // Ensure you have db.js set up with MySQL connection

// Get all wishlist items for admin
router.get('/', async (req, res) => {
    try {
        const [wishlist] = await pool.query(`
            SELECT wishlist.id, wishlist.user_id, wishlist.added_at, products.title, products.new_price
            FROM wishlist
            JOIN products ON wishlist.product_id = products.id
        `);
        res.json(wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
});

// Delete a wishlist item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM wishlist WHERE id = ?', [id]);
        res.json({ message: "Wishlist item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete wishlist item" });
    }
});
// Edit a wishlist item (e.g., updating quantity, other properties if needed)
// Add a product to the wishlist
router.post('/', async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        const [result] = await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);

        res.status(201).json({
            id: result.insertId,
            user_id,
            product_id,
            message: "Item added to wishlist successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add item to wishlist" });
    }
});

// Add a product to the cart
// Backend (Express) Route Example
// Add a product to the wishlist
router.post('/', async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        // Insert wishlist item
        const [result] = await pool.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [user_id, product_id]
        );

        // Get the newly added wishlist item with joined product info
        const [rows] = await pool.query(`
            SELECT wishlist.id, wishlist.user_id, wishlist.added_at, products.title, products.new_price
            FROM wishlist
            JOIN products ON wishlist.product_id = products.id
            WHERE wishlist.id = ?
        `, [result.insertId]);

        // Return the enriched wishlist item
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add item to wishlist" });
    }
});



// Export the router using ES6 export syntax
export default router;
