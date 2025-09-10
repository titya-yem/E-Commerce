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

router.get("/", auth, getOrders)
router.get("/:id", auth, getOrderById)
router.patch("/:id/status", auth, admin, updateOrderStatus);
router.delete("/:id", auth, admin, deleteOrder)

export default router;