import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor", // Doctor model se link
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient", // Patient model se link
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        slotTime: {
            type: String, // Example: "10:00 AM"
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending",
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: Boolean,
            default: false,
        },
        paymentMethod: {
            type: String,
            trim: true,
            default: "",
        },
        paymentReference: {
            type: String,
            trim: true,
            default: "",
        },
        paidAt: {
            type: Date,
            default: null,
        },
        symptoms: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
);

// Search fast karne ke liye indexing
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
