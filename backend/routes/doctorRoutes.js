import express from "express";
import {
    getDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    registerDoctor,
    loginDoctor,
    getDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/doctorAuth.js";

const router = express.Router();

router.get("/get", getDoctors);
router.get("/me", authDoctor, getDoctorProfile);
router.post("/add", addDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

export default router;
