import { Router } from "express";
import { createContact, getAllContacts } from "../controllers/contact.controller";
import auth from "../middlewares/auth.middleware"
import admin from "../middlewares/admin.middleware"

const router = Router();

router.post("/create", createContact);

// Admin route
router.get("/", auth, admin, getAllContacts);

export default router;