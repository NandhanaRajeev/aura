import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// Route: GET /api/admin-cart
router.get("/", async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Unauthorized access, token required" });
    }

    try {
        const [rows] = await pool.query(
            `SELECT c.user_id, c.product_id, c.quantity, c.size, p.title, p.img, p.new_price AS price, p.prev_price, p.star, p.reviews 
             FROM cart c JOIN products p ON c.product_id = p.id;`
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No cart items found" });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching cart items:", err);
        res.status(500).json({ error: "Server error fetching cart data" });
    }
});


// ✅ Add item to admin cart
// Add item to cart
router.post('/add', async (req, res) => {
    const { user_id, product_id, size, quantity } = req.body;
    if (!user_id || !product_id || !size || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
            [user_id, product_id, size]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ?',
                [quantity, user_id, product_id, size]
            );
            return res.status(200).json({ message: 'Item quantity updated in cart' });
        } else {
            await pool.query(
                'INSERT INTO cart (user_id, product_id, size, quantity) VALUES (?, ?, ?, ?)',
                [user_id, product_id, size, quantity]
            );
            return res.status(201).json({ message: 'Item added to cart' });
        }
    } catch (err) {
        console.error('Error in /add:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});


// ✅ Update item in admin cart
router.put('/update', async (req, res) => {
  const { user_id, product_id, size, quantity } = req.body;

  // Validate data
  if (!user_id || !product_id || !size || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Update the quantity of an existing cart item
    const [result] = await pool.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?',
      [quantity, user_id, product_id, size]
    );

    // Check if the item was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    return res.status(200).json({ message: 'Item quantity updated successfully' });
  } catch (err) {
    console.error('Error in /update:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart (DELETE /api/admin-cart/remove/:userId/:productId)
router.delete('/remove/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    const { size } = req.query;

    try {
        const [result] = await pool.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
            [userId, productId, size]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

export default router;
