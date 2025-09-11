import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from "../controllers/product.controller";
import auth from "../middlewares/auth.middleware"
import admin from "../middlewares/admin.middleware"

const router = Router();

// Puclic routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin (Protected) routes
router.post("/create", auth, admin, createProduct);
router.put("/:id", auth, admin, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

export default router;