import express from "express";
import authPatient from "../middleware/patientAuth.js";
import {
    createAppointment,
    getPatientAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book", authPatient, createAppointment);
router.get("/my-appointments/:patientId", authPatient, getPatientAppointments);

export default router;
