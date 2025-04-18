import express from "express";
import productRoutes from "./routes/productRoutes.js";
import { checkConnection } from "./config/db.js";
import { insertProducts, createTable } from "./utils/dbUtils.js";
import { pool } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Fetch unique categories
app.get("/api/categories", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT TRIM(category) AS category FROM products");
        res.json(rows.map(row => row.category));
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch unique brands
app.get("/api/brands", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT TRIM(company) AS company FROM products");
        res.json(rows.map(row => row.company));
    } catch (error) {
        console.error("Error fetching brands:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch unique colors
app.get("/api/colors", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DISTINCT color FROM products WHERE color IS NOT NULL");
        res.json(rows.map(row => row.color.trim()));
    } catch (error) {
        console.error("Error fetching colors:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetch filtered products (category, brand, color, query, price)
app.get("/api/products/filter", async (req, res) => {
    const { category, company, color, query, price } = req.query;
    try {
        let queryString = "SELECT * FROM products WHERE 1=1";
        let values = [];

        if (category) {
            queryString += " AND LOWER(category) LIKE LOWER(?)";
            values.push(`%${category}%`);
        }

        if (company) {
            queryString += " AND LOWER(company) LIKE LOWER(?)";
            values.push(`%${company}%`);
        }

        if (color) {
            queryString += " AND LOWER(color) LIKE LOWER(?)";
            values.push(`%${color}%`);
        }

        if (query) {
            queryString += " AND LOWER(title) LIKE LOWER(?)";
            values.push(`%${query}%`);
        }

        if (price) {
            let priceCondition = "";
            if (price == 50) priceCondition = " AND new_price BETWEEN 0 AND 50";
            else if (price == 100) priceCondition = " AND new_price BETWEEN 50 AND 100";
            else if (price == 150) priceCondition = " AND new_price BETWEEN 100 AND 150";
            else if (price == 200) priceCondition = " AND new_price > 150";

            queryString += priceCondition;
        }

        console.log("Executing Query:", queryString, values);

        const [rows] = await pool.query(queryString, values);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        await pool.query(sql, [name, email, hashedPassword]);

        res.status(200).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [results] = await pool.query(sql, [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "Login successful", token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

app.post("/ProfileForm", async (req, res) => {
  const { fullName, mobile, email, gender, dob, address } = req.body;

  try {
    const sql = `INSERT INTO users_details (full_name, mobile, email, gender, dob, address)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.query(sql, [fullName, mobile, email, gender, dob, address]);

    res.status(200).json({ message: "Profile submitted successfully" });
  } catch (err) {
    console.error("Error inserting profile:", err);
    res.status(500).json({ error: "Profile submission failed" });
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
        await checkConnection();
        await createTable();
        await insertProducts();
    } catch (error) {
        console.log("❌ Failed to initialize the database:", error);
    }
});

