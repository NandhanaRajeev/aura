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
import feedbackRoute from './routes/feedbackRoute.js';
import upiRoutes from "./routes/upiRoutes.js"; // Import UPI routes
import { authenticateUser } from "./middlewares/authMiddleware.js";
import wishlistRoutes from "./routes/wishlistRoute.js";
import newsletterRoute from './routes/newsletterRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";
import axios from "axios";
import adminCartRoute from "./routes/adminCartRoute.js";
import adminUsersRoutes from './routes/adminUsers.js';  // Import the new users route
import adminFeedbackRoutes from './routes/adminFeedbackRoute.js';
import adminProductsRoute from './routes/adminProductsRoute.js';
import adminWishlistRoute from './routes/adminWishlistRoute.js';


dotenv.config();
 
const app = express();
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow JSON body



app.use("/api/products", productRoutes);
app.use('/api/newsletter', newsletterRoute);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/feedback', feedbackRoute);
app.use("/api/upi", upiRoutes); // Add the UPI routes here
app.use("/api/wishlist", wishlistRoutes); // This links to the wishlist routes
// app.use("/api/chatbot", chatbotRoute);



// Admin Side
//  Mount the route
app.use("/api/admin-cart", adminCartRoute);
app.use('/api/admin-users', adminUsersRoutes); 
app.use("/api/admin-feedback", adminFeedbackRoutes);
app.use("/api/admin-products",adminProductsRoute);
app.use("/api/admin-wishlist",adminWishlistRoute);

// Chatbot
app.post('/api/chat', async (req, res) => {
  try {
      const userMessage = req.body.message;
      if (!userMessage || userMessage.trim().length === 0) {
          return res.status(400).json({ error: "Message cannot be empty" });
      }

      const response = await axios.post(
          'https://api.deepseek.com/chat/completions',
          {
              model: 'deepseek-chat',
              messages: [{ role: 'user', content: userMessage }],
              stream: false,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.CHATBOT_API_KEY}`,
              },
          }
      );

      const botReply = response.data.choices[0].message.content;
      res.json({ reply: botReply });

  } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).send("Failed to get response from chatbot API");
  }
});
// Newsletter subscription route
app.post("/api/subscribe", async (req, res) => {
  const { email, userId } = req.body;

  // Validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID is required for the subscription." });
  }

  try {
    // Insert the email and user_id into the database
    const sql = "INSERT INTO newsletter_subscribers (email, user_id) VALUES (?, ?)";
    await pool.query(sql, [email, userId]);

    res.status(200).json({ message: "Thank you for subscribing to our newsletter!" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Landing Page Biggest Deals Section
app.get("/api/products/discounted", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
      id,
      title,
      company,
      img,
      CAST(REPLACE(prev_price, '$', '') AS DECIMAL(10, 2)) AS prev_price,
      new_price
      FROM products
      WHERE 
      CAST(REPLACE(prev_price, '$', '') AS DECIMAL(10, 2)) > 0
      AND new_price <= CAST(REPLACE(prev_price, '$', '') AS DECIMAL(10, 2)) * 0.75
      LIMIT 6;
      `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get latest 5 products for "Latest Collection"
app.get("/api/products/latest", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, img, title, new_price, prev_price
      FROM products
      ORDER BY id DESC
      LIMIT 8
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching latest products:", err);
    res.status(500).json({ message: "Server error" });
  }
});


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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [results] = await pool.query(sql, [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        console.log("User from DB:", user);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "Login successful", token, is_admin: user.is_admin });

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

// API ROUTE - listen to POST /api/feedback
app.post('/api/feedback', async (req, res) => {
    const { name, email, rating, comments } = req.body;
  
    if (!name || !email || !rating || !comments) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const [result] = await pool.promise().query(
        'INSERT INTO feedback (name, email, rating, comments) VALUES (?, ?, ?, ?)',
        [name, email, rating, comments]
      );
  
      res.json({ message: 'Feedback saved successfully!' });
    } catch (error) {
      console.error('Error saving feedback:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  // Delete user account
app.delete("/api/users/delete", authenticateUser, async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT token (set by authenticateUser middleware)
  
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// const PORT = process.env.PORT || 3001;
const PORT = 3000;
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

