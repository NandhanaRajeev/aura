import express from "express";
import { saveUpi, getUserUpi } from "../controllers/upiController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js"; // Assuming you have an auth middleware

const router = express.Router();

// Route to save the UPI ID
router.post("/save", authenticateUser, saveUpi);

// Route to get the UPI ID of the authenticated user
router.get("/get", authenticateUser, getUserUpi);

export default router;
