import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAllAppointments
} from "../controllers/appointment.controller";

const router = Router();

router.get("/", getAllAppointments)
router.post("/create", createAppointment)
router.delete("/:id", deleteAppointment)

export default router;