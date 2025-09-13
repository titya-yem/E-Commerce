import { Router } from "express";
import {
    createService,
    deleteService,
    getAllServices,
    updateService,
} from "../controllers/service.controller";
import auth from "../middlewares/auth.middleware"
import admin from "../middlewares/admin.middleware"

const router = Router()

// Public route
router.get("/", getAllServices);

// Protected routes
router.post("/create", auth, admin, createService);
router.put("/:id", auth, admin, updateService);
router.delete("/:id", auth, admin, deleteService);

export default router