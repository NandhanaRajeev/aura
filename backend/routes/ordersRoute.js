import express from 'express';
import { getAllOrders, createOrder } from '../controllers/ordersController.js';

const router = express.Router();

// Fetch all orders
router.get('/', getAllOrders);

// Create a new order
router.post('/', createOrder);

export default router;
