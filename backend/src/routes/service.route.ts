import { Router } from "express";
import {
    createService,
    deleteService,
    getAllServices,
    updateService,
} from "../controllers/service.controller";

const router = Router()

router.get("/", getAllServices);
router.post("/create", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router