import express from "express";
import {
    registerPatient,
    loginPatient,
    getPatientProfile,
} from "../controllers/patientController.js";
import authPatient from "../middleware/patientAuth.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.get("/me", authPatient, getPatientProfile);

export default router;
