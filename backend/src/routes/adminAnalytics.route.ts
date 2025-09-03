import express from "express";
import { 
    getSalesPerMonth, 
    getOrdersPerMonth, 
    getRevenueAnalytics 
} from "../controllers/adminAnalytics.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware"

const router = express.Router();

router.get("/sales/month", auth, admin, getSalesPerMonth);
router.get("/orders/month", auth, admin, getOrdersPerMonth);
router.get("/revenue/five-months", auth, admin, getRevenueAnalytics);

export default router;