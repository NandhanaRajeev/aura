import {
    getUserOrders,
    addOrder,
    removeOrder,
    updateOrder
} from "../models/ordersModel.js";

import { getUserCart, clearUserCart } from "../models/cartModel.js"; // You need these functions


// NEW: Add all cart items to orders after successful payment
export const addOrdersAfterPaymentController = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await getUserOrders(userId);

        // Step 1: Get all cart items
        const cartItems = await getUserCart(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Step 2: Add each cart item as an order
        for (const item of cartItems) {
            const { product_id, quantity, size, total_price } = item;
            await addOrder(userId, product_id, quantity, size, total_price);
        }

        // Step 3: Clear user's cart
        await clearUserCart(userId);

        res.status(201).json({ message: "Order(s) placed after successful payment" });
    } catch (error) {
        res.status(500).json({ message: "Error processing order after payment", error });
    }
};


// Get all orders of a user
export const getOrdersController = async (req, res) => {
    try {
        const user_id = req.user.id; // Assume userId is provided by JWT
        const orders = await getUserOrders(user_id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

// Add an order
export const addOrderController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity, size, total_price } = req.body;
        const orderId = await addOrder(userId, product_id, quantity, size, total_price);
        res.status(201).json({ message: "Order added", orderId });
    } catch (error) {
        res.status(500).json({ message: "Error adding order", error });
    }
};

// Remove an order
export const removeOrderController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { productId, size } = req.params; // Expecting productId and size
        await removeOrder(user_id, productId, size);
        res.json({ message: "Order removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing order", error });
    }
};

// Update an order
export const updateOrderController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { productId, quantity, size, total_price } = req.body;
        await updateOrder(user_id, productId, quantity, size, total_price);
        res.json({ message: "Order updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};
