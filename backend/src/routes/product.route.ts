import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/create", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;