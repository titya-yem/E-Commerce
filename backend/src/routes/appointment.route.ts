import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAllAppointments,
    getAppointmentsByMonthly,
    updateAppointment,
    getMyAppointments
} from "../controllers/appointment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

// user route
router.post("/create", auth, createAppointment)
router.get("/my-appointments", auth, getMyAppointments);

// admin routes
router.get("/", auth, admin, getAllAppointments)
router.get("/monthly", auth, admin, getAppointmentsByMonthly)
router.patch("/:id/status", auth, admin, updateAppointment)
router.delete("/:id", auth, admin, deleteAppointment)

export default router;