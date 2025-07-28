import { Request, Response } from "express";
import Contact from "../models/contact.model";
import contactValidation from "../validations/contact.validation";

export const createContact = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { error, value } = contactValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const contact = await Contact.create(value);
        
        res.status(201).json(contact);        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create contact" });
    }
}

export const getAllContacts = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const contacts = await Contact.find().select("-__v");
        
        res.status(200).json(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get contacts" });
    }
}