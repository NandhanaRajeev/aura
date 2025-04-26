// src/routes/userRoutes.js
import express from "express";
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { getCurrentUser } from '../controllers/userController.js';


import { signup, login, getUserById, updateUserById } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);             // Signup route
router.post("/login", login);               // Login route
router.get("/:id", getUserById);            // Get user by ID
router.put("/:id", updateUserById);         // Update user details by ID
router.get("/", authenticateUser, getCurrentUser); // GET /api/users (current logged-in user)
// routes/userRoutes.js or similar
router.get("/users", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id; // decoded token must contain an `id`
  
      // Check if userId exists
      if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  
      if (!user.length) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  export default router;
