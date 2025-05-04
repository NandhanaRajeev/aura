import { pool } from "../config/db.js";

// Get user's wishlist
export const getUserWishlist = async (userId) => {
    try {
        // Execute the query to fetch wishlist for the given userId
        const [rows] = await pool.query(
            "SELECT * FROM wishlist WHERE user_id = ?",  // Your SQL query
            [userId]  // UserId passed as a parameter to prevent SQL injection
        );
        
        console.log("Fetched Wishlist: ", rows); // Log the fetched wishlist to ensure it’s correct
        
        return rows;  // Return the rows (which represent the wishlist items)
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw new Error("Failed to fetch wishlist");  // Throw an error if the query fails
    }
};
// Add item to wishlist
export const addToWishlist = async (userId, productId) => {
    try {
        // Check if the item already exists in wishlist
        const [existingWishlist] = await pool.query(
            "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (existingWishlist.length === 0) {
            // Insert into wishlist
            await pool.query(
                "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
                [userId, productId]
            );
            
            // Insert the item into cart (with quantity set to 1)
            await pool.query(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                [userId, productId, 1]
            );
        } else {
            console.log("Item already in wishlist");
        }
    } catch (error) {
        console.error("Error adding item to wishlist:", error);
        throw new Error("Failed to add item to wishlist");
    }
};


// Remove item from wishlist
export const removeFromWishlist = async (userId, productId) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );
        return result.affectedRows; // Return the number of rows deleted
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        throw new Error("Failed to remove item from wishlist");
    }
};