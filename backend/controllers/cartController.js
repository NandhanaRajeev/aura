import {
    getUserCart,
    removeFromCart,
    updateQuantity,
} from "../models/cartModel.js";

export const getCartController = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await getUserCart(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

export const removeItemController = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await removeFromCart(userId, productId);
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
};

export const updateQuantityController = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        await updateQuantity(userId, productId, quantity);
        res.json({ message: "Quantity updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error });
    }
};

// NEW: Clear cart after successful payment
export const clearCartAfterPaymentController = async (req, res) => {
    try {
        const { userId } = req.params;
        await clearUserCart(userId);
        res.json({ message: "Cart cleared after successful payment" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};
