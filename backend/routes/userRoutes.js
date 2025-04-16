import express from "express";
import { signup, login, getUserById } from "../controllers/userController.js";
// import { pool } from "../config/data.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getUserById);


// // Fetch user profile by ID
// router.get("/:id", async (req, res) => {
//     const userId = req.params.id;
  
//     try {
//       const [rows] = await pool.query(
//         "SELECT * FROM users_details WHERE id = ?",
//         [userId]
//       );
  
//       if (rows.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       res.json(rows[0]);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
  

export default router;
