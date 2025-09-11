import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import AppointmentValidation from "../validations/appointment.validation";

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const appointments = await Appointment.find().select("-__v");
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get appointments" });
    }
}

// Create a new appointment
export const createAppointment = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { error, value } = AppointmentValidation.validate(req.body, { abortEarly: false });
        if (error) {
        console.log("Validation Error:", error.details);
        return res.status(400).json({ message: error.details[0].message });
        }

        const newAppointment = new Appointment(value)
        await newAppointment.save()

        res.status(201).json(newAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create appointment" });
    }
}

// Update an appointment (status)
export const updateAppointment = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ message: "Appointment ID and Status are required!" });
        }

        if (!["Incomplete", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updated = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update appointment status" });
    }
};


// Delete a appointment
export const deleteAppointment = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        const deleteAppointment = await Appointment.findByIdAndDelete(id)
        if (!deleteAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete appointment" });
    }
}

// Get appointments by monthly
export const getAppointmentsByMonthly = async (req: Request, res: Response) => {
    try {
        const range = req.query.range as string || 'monthly';
        let start: Date | undefined;
        let end: Date | undefined;

        if (range === 'monthly') {
            start = new Date();
            start.setDate(1);  // start of month
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0); // last day of month
            end.setHours(23, 59, 59, 999);
        }

        if (!start || !end) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        const appointments = await Appointment.find({
            date: { 
                $gte: start.toISOString().split('T')[0], 
                $lte: end.toISOString().split('T')[0] 
            }
        });


        // Return array, even if empty
        res.status(200).json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get appointments" });
    }
};