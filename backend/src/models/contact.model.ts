import mongoose, { Document } from "mongoose";

interface ContactProps extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message?: string;
}

const contactSchema = new mongoose.Schema<ContactProps>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
}, { timestamps: true });

const Contact = mongoose.model<ContactProps>("Contact", contactSchema);

export default Contact;
