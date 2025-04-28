import { 
    addItemToWishlist, 
    removeItemFromWishlist, 
    getUserWishlist 
} from "../models/wishlistModel.js";  // Assuming you have these functions defined in your wishlist model

// Fetch the user's wishlist
export const getWishlistController = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await getUserWishlist(userId);  // Fetch wishlist for a specific user
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wishlist", error });
    }
};

// Add item to wishlist
export const addItemToWishlistController = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        // Add the item to the wishlist
        await addItemToWishlist(userId, productId);
        res.json({ message: "Item added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Error adding item to wishlist", error });
    }
};

// Remove item from wishlist
// Remove item from wishlist and cart
export const removeItemFromWishlistController = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const result = await removeFromWishlist(userId, productId);

        if (result === 0) {
            return res.status(400).json({ message: "Item not found in wishlist" });
        }

        res.json({ message: "Item removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item from wishlist", error });
    }
};