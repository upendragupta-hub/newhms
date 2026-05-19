import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    ward: { type: String, default: "General" },
    roomNumber: { type: String, required: true },
    type: { type: String, default: "General" },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    patientName: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Bed", bedSchema);
