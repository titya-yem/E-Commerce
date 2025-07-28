import { Router } from "express";
import { createContact, getAllContacts } from "../controllers/contact.controller";

const router = Router();

router.get("/", getAllContacts);
router.post("/create", createContact);

export default router;