import express from "express";
import {
    bookAppointment,
    createAppointment,
    getAllAppointments,
    getPatientAppointments,
    updateAppointmentStatus,
    updateDoctorAppointmentStatus,
    cancelPatientAppointment,
    deleteAppointment,
    getDoctorAppointments,
    payPatientAppointmentBill,
    createRazorpayOrder,
} from "../controllers/appointmentController.js";
import authPatient from "../middleware/patientAuth.js";
import authDoctor from "../middleware/doctorAuth.js";
import verifyAdmin from "../middleware/authMiddleware.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", verifyAdmin, getAllAppointments);
appointmentRouter.get("/my-appointments", authPatient, getPatientAppointments);
appointmentRouter.get("/patient/:patientId", authPatient, getPatientAppointments);
appointmentRouter.get("/doctor/my-appointments", authDoctor, getDoctorAppointments);
appointmentRouter.post("/", authPatient, createAppointment);
appointmentRouter.post("/book", authPatient, createAppointment);
appointmentRouter.post("/book-appointment", authPatient, bookAppointment);
appointmentRouter.post("/:id/razorpay-order", authPatient, createRazorpayOrder);
appointmentRouter.put("/status/:id", verifyAdmin, updateAppointmentStatus);
appointmentRouter.put("/doctor/status/:id", authDoctor, updateDoctorAppointmentStatus);
appointmentRouter.delete("/delete/:id", verifyAdmin, deleteAppointment);
appointmentRouter.patch("/:id/cancel", authPatient, cancelPatientAppointment);
appointmentRouter.patch("/:id/pay", authPatient, payPatientAppointmentBill);

export default appointmentRouter;
