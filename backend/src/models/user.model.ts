import mongoose from "mongoose";

interface userTypes extends mongoose.Document {
    userName: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
  };

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true, optional: true  },
}, { timestamps: true });

const User = mongoose.model<userTypes>("User", userSchema);

export default User;