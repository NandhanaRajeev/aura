import { pool } from '../config/db.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { img, title, star, reviews, prev_price, new_price, company, color, category } = req.body;
        await pool.query(
            `INSERT INTO products (img, title, star, reviews, prev_price, new_price, company, color, category) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [img, title, star, reviews, prev_price, new_price, company, color, category]
        );
        res.status(201).json({ message: 'Product created successfully!' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
