import { Router } from "express";
import {
    deleteOrder,
    getOrderById,
    getOrders,
    updateOrderStatus,
} from "../controllers/order.controller";
import admin from "../middlewares/admin.middleware";
import auth from "../middlewares/auth.middleware";

const router = Router();

// User's own orders
router.get("/me", auth, getOrders);

// Get a specific order by ID
router.get("/:id", auth, getOrderById);

// Admin Routes
router.patch("/:id/status", auth, admin, updateOrderStatus);
router.delete("/:id", auth, admin, deleteOrder);

export default router;