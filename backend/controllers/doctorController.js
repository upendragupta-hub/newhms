import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";

const createDoctorToken = (doctorId) =>
    jwt.sign(
        { id: doctorId, role: "doctor" },
        process.env.JWT_SECRET || "apni_secret_key",
        { expiresIn: "7d" }
    );

const normalizeNumber = (value) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const serializeDoctor = (doctorDoc) => {
    const doctor = doctorDoc.toObject ? doctorDoc.toObject() : doctorDoc;
    const { password, ...safeDoctor } = doctor;
    return safeDoctor;
};

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("-password");
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctors", error });
    }
};

export const addDoctor = async (req, res) => {
    try {
        const {
            name,
            specialization,
            experience,
            fee,
            image,
            email,
            phone,
            available,
            password,
        } = req.body;

        const normalizedExperience = normalizeNumber(experience);
        const normalizedFee = normalizeNumber(fee);

        if (normalizedExperience === null || normalizedFee === null) {
            return res.status(400).json({
                message: "Experience aur fee valid number hone chahiye.",
            });
        }

        const newDoctor = new Doctor({
            name,
            specialization,
            experience: normalizedExperience,
            fee: normalizedFee,
            image,
            email,
            phone,
            available,
            password: password || "doctor123",
        });

        const savedDoctor = await newDoctor.save();

        res.status(201).json({
            message: "Doctor added successfully",
            doctor: serializeDoctor(savedDoctor),
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding doctor", error });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            specialization,
            experience,
            fee,
            image,
            email,
            phone,
            available,
        } = req.body;

        const normalizedExperience = normalizeNumber(experience);
        const normalizedFee = normalizeNumber(fee);

        if (normalizedExperience === null || normalizedFee === null) {
            return res.status(400).json({
                success: false,
                message: "Experience aur fee valid number hone chahiye.",
            });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            {
                name,
                specialization,
                experience: normalizedExperience,
                fee: normalizedFee,
                image,
                email,
                phone,
                available,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully.",
            doctor: updatedDoctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const registerDoctor = async (req, res) => {
    try {
        const {
            name,
            specialization,
            experience,
            fee,
            image,
            email,
            password,
            phone,
        } = req.body;

        const normalizedExperience = normalizeNumber(experience);
        const normalizedFee = normalizeNumber(fee);

        if (
            !name ||
            !specialization ||
            normalizedExperience === null ||
            normalizedFee === null ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Doctor details complete bharna zaruri hai.",
            });
        }

        const existingDoctor = await Doctor.findOne({ email });

        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists",
            });
        }

        const doctor = await Doctor.create({
            name,
            specialization,
            experience: normalizedExperience,
            fee: normalizedFee,
            image,
            email,
            password,
            phone,
        });

        res.status(201).json({
            success: true,
            message: "Doctor registered successfully.",
            token: createDoctorToken(doctor._id),
            doctor: serializeDoctor(doctor),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email aur password required hain.",
            });
        }

        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor not found",
            });
        }

        if (doctor.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: createDoctorToken(doctor._id),
            doctor: serializeDoctor(doctor),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.doctorId).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        res.status(200).json({
            success: true,
            doctor: serializeDoctor(doctor),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDoctorProfile = async (req, res) => {
    try {
        const {
            name,
            specialization,
            experience,
            fee,
            image,
            email,
            phone,
            available,
            password,
        } = req.body;

        const normalizedExperience = normalizeNumber(experience);
        const normalizedFee = normalizeNumber(fee);

        if (normalizedExperience === null || normalizedFee === null) {
            return res.status(400).json({
                success: false,
                message: "Experience aur fee valid number hone chahiye.",
            });
        }

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor && existingDoctor._id.toString() !== req.doctorId) {
            return res.status(400).json({
                success: false,
                message: "Ye email kisi aur doctor ke paas already registered hai.",
            });
        }

        const updateFields = {
            name,
            specialization,
            experience: normalizedExperience,
            fee: normalizedFee,
            image,
            email,
            phone,
            available,
        };

        if (password) {
            updateFields.password = password;
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.doctorId,
            updateFields,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully.",
            doctor: updatedDoctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
