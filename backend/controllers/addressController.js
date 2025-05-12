import { pool } from "../config/db.js";

export const submitaddress = async (req, res) => {
  const { fullName, mobile, address, pincode } = req.body;
  const user_id = req.user.id; // ✅ get from decoded token

  if (!user_id || !fullName || !mobile || !address || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql = `INSERT INTO address (user_id, fullName, mobile, address, pincode)
                 VALUES (?, ?, ?, ?, ?)`;
    await pool.query(sql, [user_id, fullName, mobile, address, pincode]);

    res.status(200).json({ message: "Address submitted successfully" });
  } catch (err) {
    console.error("❌ Error inserting address:", err);
    res.status(500).json({ error: "Failed to save address" });
  }
};

export const getUserAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const [address] = await pool.query(
      "SELECT * FROM address WHERE user_id = ?",
      [userId]
    );

    res.status(200).json(address);
  } catch (error) {
    console.error("❌ Error fetching address:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};
