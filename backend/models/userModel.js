import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "0000000000" }, // Optional: Phone field add kar di
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;