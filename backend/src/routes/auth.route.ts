import { Router } from "express";
import {
    getMe,
    signIn,
    signOut,
    updateMe
} from "../controllers/auth.controller";
import auth from "../middlewares/auth.middleware"

const router = Router()

router.post("/signin", signIn)
router.post("/signout", signOut)

// Protected route
router.get("/me", auth, getMe)
router.put("/me", auth, updateMe)

export default router;