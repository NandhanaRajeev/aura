import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// GET all users (Admin view)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, gender, dob, address, created_at FROM users');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Get count of users.
router.get('/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, gender, dob, address, created_at FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// PUT update user details
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, gender, dob, address } = req.body;
    
    try {
        const [result] = await pool.query(
            `UPDATE users SET name = ?, email = ?, phone = ?, gender = ?, dob = ?, address = ? WHERE id = ?`,
            [name, email, phone, gender, dob, address, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    console.log(`Attempting to delete user with ID: ${userId}`);  // Add this line
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.post('/', async (req, res) => {
    const { name, email, phone, gender, dob, address } = req.body;

    if (!name || !email || !phone || !gender || !dob || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO users (name, email, phone, gender, dob, address) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, gender, dob, address]
        );
        res.status(201).json({ message: 'User added successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});





export default router;
