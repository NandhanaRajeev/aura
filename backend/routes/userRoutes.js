// src/routes/userRoutes.js
import express from "express";
import { signup, login, getUserById, updateUserById } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);             // Signup route
router.post("/login", login);               // Login route
router.get("/:id", getUserById);            // Get user by ID
router.put("/:id", updateUserById);         // Update user details by ID

export default router;
