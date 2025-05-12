import express from "express";
import {
  getOrdersController,
  addOrderController,
  removeOrderController,
  updateOrderController,
  addOrdersAfterPaymentController,
} from "../controllers/ordersController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { getUserOrders } from "../models/ordersModel.js";

const router = express.Router();

router.get("/", authenticateUser, getOrdersController);
router.post("/add", authenticateUser, addOrderController);
router.delete("/remove/:orderId", authenticateUser, removeOrderController);
router.put("/update", authenticateUser, updateOrderController);
router.post("/after-payment", authenticateUser, addOrdersAfterPaymentController);
router.get('/orders/:user_id', authenticateUser, getUserOrders);
export default router;
