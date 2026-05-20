import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createPatientToken = (patientId) =>
    jwt.sign(
        { id: patientId },
        process.env.JWT_SECRET || "apni_secret_key",
        { expiresIn: "7d" }
    );

const serializePatient = (patient) => ({
    id: patient._id,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    gender: patient.gender || "",
    age: patient.age || "",
    address: patient.address || "",
    visitCount: patient.visitCount || 0,
});

export const registerPatient = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            gender,
            age,
            address,
        } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone aur password required hain.",
            });
        }

        const existingPatient = await Patient.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Email ya phone pehle se registered hai.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = await Patient.create({
            name,
            email,
            phone,
            password: hashedPassword,
            gender: gender || undefined,
            age: age || undefined,
            address: address || "",
        });

        const token = createPatientToken(patient._id);

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            token,
            patient: serializePatient(patient),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email aur password required hain.",
            });
        }

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            patient.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password.",
            });
        }

        const token = createPatientToken(patient._id);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            patient: serializePatient(patient),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.patientId).select("-password");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        res.status(200).json({
            success: true,
            patient: serializePatient(patient),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePatientProfile = async (req, res) => {
    try {
        const { name, email, phone, gender, age, address, password } = req.body;

        const existingEmail = await Patient.findOne({
            email,
            _id: { $ne: req.patientId },
        });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Ye email kisi aur patient ke paas already registered hai.",
            });
        }

        const existingPhone = await Patient.findOne({
            phone,
            _id: { $ne: req.patientId },
        });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Ye phone kisi aur patient ke paas already registered hai.",
            });
        }

        const updateFields = {
            name,
            email,
            phone,
            gender,
            age: age !== undefined ? age : undefined,
            address,
        };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.patientId,
            updateFields,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Patient profile updated successfully.",
            patient: serializePatient(updatedPatient),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
