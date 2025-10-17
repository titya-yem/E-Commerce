import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
} from "../controllers/user.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router()

// public route
router.post("/signup", createUser);

// user routes & public routes
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

// admin routes
router.get("/", auth, admin, getAllUsers);

export default router