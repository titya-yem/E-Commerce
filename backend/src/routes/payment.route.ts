import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.post("/create-checkout-session", auth, createCheckoutSession);

export default router;