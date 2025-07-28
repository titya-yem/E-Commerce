import mongoose, { Document } from "mongoose";

interface ContactProps extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    message: string;
}

const contactShcema = new mongoose.Schema<ContactProps>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: Number, required: true },
    message: { type: String, trim: true },
}, { timestamps: true });

const Contact = mongoose.model<ContactProps>("Contact", contactShcema);

export default Contact;