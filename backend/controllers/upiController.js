import { insertUpi, getUpiByUserId } from "../models/upiModel.js";

// Controller to handle saving the UPI ID and 'Remember UPI' option
export const saveUpi = async (req, res) => {
    const { upiId, rememberUpi } = req.body; // Assume rememberUpi is a boolean

    try {
        const userId = req.user.id; // Assuming the user is authenticated
        await insertUpi(userId, upiId, rememberUpi);
        res.status(200).json({ message: "UPI ID saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save UPI ID" });
    }
};

// Controller to handle fetching the UPI ID for a user
export const getUserUpi = async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT token (assuming the user is authenticated)

    try {
        const upi = await getUpiByUserId(userId);
        if (upi.length > 0) {
            res.status(200).json(upi); // Send all UPI ID details back
        } else {
            res.status(404).json({ message: "No UPI ID found for this user" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch UPI ID" });
    }
};