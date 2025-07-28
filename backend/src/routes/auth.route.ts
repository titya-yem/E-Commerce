import { Router } from "express";
import {
    getMe,
    signIn,
    signOut
} from "../controllers/auth.controller";

const router = Router()

router.post("/signin", signIn)
router.post("/signout", signOut)
router.get("/me", getMe)

export default router;