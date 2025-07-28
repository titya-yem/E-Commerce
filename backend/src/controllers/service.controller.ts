import { Request, Response } from "express";
import Service from "../models/service.model";
import serviceValidation from "../validations/service.validation";

// Get all services
export const getAllServices = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const services = await Service.find().select("-__v");
        if (!services || services.length === 0) {
            return res.status(404).json({ message: "No services found" });
        }

        res.status(200).json(services);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get services" });
    }
}

// Create a new service
export const createService = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { error, value } = serviceValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const service = new Service(value)
        await service.save()

        res.status(201).json(service);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create service" });
    }
}

// Update a service
export const updateService = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({ message: "Service id is required" });
        }

        const { error, value } = serviceValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updateService = await Service.findByIdAndUpdate(id, value, { new: true })
        if (!updateService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(updateService);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update service" });
    }
}

// Delete a service
export const deleteService = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({ message: "Service id is required" });
        }

        const deleteService = await Service.findByIdAndDelete(id)
        if (!deleteService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete service" });
    }
}