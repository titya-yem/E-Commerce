import mongoose, { Document } from "mongoose";

enum appointmentTypes {
    Vacation = "Vacation",
    Bathing = "Bathing",
    CutAndTrim = "Cut and Trim hair",
    FoodAndSupplies = "Food and Supplies",
    Party = "Party",
}

interface appointmentProps extends Document{
    type: appointmentTypes;
    name: mongoose.Types.ObjectId;
    email: string;
    time: string;
    date: string;
    message: string;
}

const appointmentSchema = new mongoose.Schema<appointmentProps>({
    type: {type: String, enum: Object.values(appointmentTypes), required: true},
    name: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    email: {type: String, required: true},
    time: {type: String, required: true},
    date: {type: String, required: true},
    message: { type: String },
}, { timestamps: true });

const Appointment = mongoose.model<appointmentProps>("Appointment", appointmentSchema);

export default Appointment;