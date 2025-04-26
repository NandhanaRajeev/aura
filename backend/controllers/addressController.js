import { pool } from "../config/db.js";

export const submitaddress = async (req, res) => {
  const { fullName, mobile, address, pincode } = req.body;

  if (!fullName || !mobile || !address || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql = `INSERT INTO users_details (fullName, mobile, address, pincode)
                 VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [fullName, mobile, address, pincode]);

    res.status(200).json({ message: "Address submitted successfully" });
  } catch (err) {
    console.error("❌ Error inserting address:", err);
    res.status(500).json({ error: "Failed to save address" });
  }
};
