import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Naya field
    phone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    age: { type: Number },
    address: { type: String },
    visitCount: { type: Number, default: 0 },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
