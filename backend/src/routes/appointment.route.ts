import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAllAppointments,
    getAppointmentsByMonthly
} from "../controllers/appointment.controller";

const router = Router();

router.get("/", getAllAppointments)
router.get("/monthly", getAppointmentsByMonthly)
router.post("/create", createAppointment)
router.delete("/:id", deleteAppointment)

export default router;