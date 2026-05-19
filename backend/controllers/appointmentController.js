import crypto from "crypto";
import Razorpay from "razorpay";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { sendBookingNotifications } from "../utils/notificationHelper.js";

const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
        throw new Error(
            "Razorpay configuration missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env."
        );
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

const PAYMENT_METHODS = [
    "UPI",
    "Card",
    "NetBanking",
    "Wallet",
    "Cash",
    "Insurance",
    "Razorpay",
];

const appointmentPopulate = [
    {
        path: "doctorId",
        select: "name specialization experience fee image available email phone",
    },
    {
        path: "patientId",
        select: "name email phone gender age address visitCount",
    },
];

const historyPopulate = [
    {
        path: "doctorId",
        select: "name specialization fee image",
    },
];

const buildBillNumber = (appointment) =>
    `BILL-${new Date(
        appointment.createdAt || appointment.appointmentDate || Date.now()
    ).getFullYear()}-${appointment._id.toString().slice(-6).toUpperCase()}`;

const getBillStatus = (appointment) => {
    if (appointment.status === "Cancelled" && appointment.paymentStatus) {
        return "Refund pending";
    }

    if (appointment.status === "Cancelled") {
        return "Cancelled";
    }

    return appointment.paymentStatus ? "Paid" : "Pending";
};

const serializeBill = (appointment) => ({
    number: buildBillNumber(appointment),
    amount: appointment.amount || 0,
    status: getBillStatus(appointment),
    issuedAt: appointment.createdAt || appointment.appointmentDate || null,
    dueDate: appointment.appointmentDate || null,
    paymentMethod: appointment.paymentMethod || "",
    paymentReference: appointment.paymentReference || "",
    paidAt: appointment.paidAt || null,
});

const serializeHistoryEntry = (appointmentDoc) => {
    const appointment = appointmentDoc.toObject
        ? appointmentDoc.toObject()
        : appointmentDoc;

    return {
        _id: appointment._id,
        appointmentDate: appointment.appointmentDate,
        slotTime: appointment.slotTime,
        status: appointment.status,
        amount: appointment.amount,
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod || "",
        paymentReference: appointment.paymentReference || "",
        paidAt: appointment.paidAt || null,
        bill: serializeBill(appointment),
        symptoms: appointment.symptoms || "",
        notes: appointment.notes || "",
        doctor: appointment.doctorId
            ? {
                  _id: appointment.doctorId._id,
                  name: appointment.doctorId.name || "",
                  specialization: appointment.doctorId.specialization || "",
                  fee: appointment.doctorId.fee || 0,
                  image: appointment.doctorId.image || "",
              }
            : null,
    };
};

const serializeAppointment = (appointmentDoc) => {
    const appointment = appointmentDoc.toObject
        ? appointmentDoc.toObject()
        : appointmentDoc;

    return {
        ...appointment,
        doctor: appointment.doctorId,
        patient: appointment.patientId,
        patientName: appointment.patientId?.name || "",
        patientPhone: appointment.patientId?.phone || "",
        patientEmail: appointment.patientId?.email || "",
        bill: serializeBill(appointment),
        patientProfile: appointment.patientId
            ? {
                  _id: appointment.patientId._id,
                  name: appointment.patientId.name || "",
                  email: appointment.patientId.email || "",
                  phone: appointment.patientId.phone || "",
                  gender: appointment.patientId.gender || "",
                  age: appointment.patientId.age || "",
                  address: appointment.patientId.address || "",
                  visitCount: appointment.patientId.visitCount || 0,
              }
            : null,
        patientHistory: appointment.patientHistory || [],
        patientHistorySummary: appointment.patientHistorySummary || {
            totalAppointments: 0,
            previousAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
            lastVisitDate: null,
        },
    };
};

const resolvePatientId = (req) =>
    req.patientId ||
    req.params.patientId ||
    req.body.patientId ||
    req.body.patient;

const normalizeAppointmentDate = (value) => {
    if (!value) {
        return null;
    }

    const normalizedValue =
        typeof value === "string" ? value : String(value);

    const parsedDate = normalizedValue.includes("T")
        ? new Date(normalizedValue)
        : new Date(`${normalizedValue}T00:00:00.000Z`);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const normalizeAmount = (value) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const normalizePaymentMethod = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const trimmedValue = value.trim();

    return PAYMENT_METHODS.includes(trimmedValue) ? trimmedValue : "";
};

const buildPaymentReference = (appointmentId) =>
    `PAY-${Date.now().toString(36).toUpperCase()}-${appointmentId
        .toString()
        .slice(-4)
        .toUpperCase()}`;

const verifyRazorpaySignature = (
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
) => {
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

    return generatedSignature === razorpaySignature;
};

export const createRazorpayOrder = async (req, res) => {
    try {
        const patientId = resolvePatientId(req);
        const { id } = req.params;

        if (!patientId) {
            return res.status(401).json({
                success: false,
                message: "Patient login required.",
            });
        }

        const appointment = await Appointment.findOne({
            _id: id,
            patientId,
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment bill not found.",
            });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled appointment ka bill pay nahi kiya ja sakta.",
            });
        }

        if (appointment.paymentStatus) {
            return res.status(400).json({
                success: false,
                message: "Is appointment ka payment pehle se ho chuka hai.",
            });
        }

        const amountInPaise = Math.round((appointment.amount || 0) * 100);

        if (amountInPaise <= 0) {
            return res.status(400).json({
                success: false,
                message: "Appointment amount valid nahi hai.",
            });
        }

        const razorpay = getRazorpayClient();
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `appointment_${appointment._id.toString()}`,
            payment_capture: 1,
            notes: {
                appointmentId: appointment._id.toString(),
                patientId: patientId.toString(),
            },
        });

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID || "",
        });
    } catch (error) {
        console.error("createRazorpayOrder error:", error);
        const sdkDesc = error?.error?.description || error?.error || null;
        const message = error?.message || sdkDesc || JSON.stringify(error) || "Internal server error";
        res.status(500).json({
            success: false,
            message,
        });
    }
};

const updatePatientVisitCount = async (patientId) => {
    const visitCount = await Appointment.countDocuments({ patientId });
    await Patient.findByIdAndUpdate(patientId, { visitCount });
};

const attachPatientHistory = async (appointmentDocs) => {
    if (!appointmentDocs.length) {
        return [];
    }

    const patientIds = [
        ...new Set(
            appointmentDocs
                .map((appointment) =>
                    appointment.patientId?._id
                        ? appointment.patientId._id.toString()
                        : appointment.patientId?.toString()
                )
                .filter(Boolean)
        ),
    ];

    if (!patientIds.length) {
        return appointmentDocs.map(serializeAppointment);
    }

    const historyDocs = await Appointment.find({
        patientId: { $in: patientIds },
    })
        .populate(historyPopulate)
        .sort({ appointmentDate: -1, createdAt: -1 });

    const historyMap = historyDocs.reduce((accumulator, entry) => {
        const patientId = entry.patientId.toString();

        if (!accumulator.has(patientId)) {
            accumulator.set(patientId, []);
        }

        accumulator.get(patientId).push(entry);
        return accumulator;
    }, new Map());

    return appointmentDocs.map((appointmentDoc) => {
        const patientId = appointmentDoc.patientId?._id
            ? appointmentDoc.patientId._id.toString()
            : appointmentDoc.patientId?.toString();

        const allHistoryEntries = historyMap.get(patientId) || [];
        const previousHistoryEntries = allHistoryEntries.filter(
            (entry) => entry._id.toString() !== appointmentDoc._id.toString()
        );
        const lastVisitEntry = previousHistoryEntries[0] || null;
        const serializedAppointment = serializeAppointment(appointmentDoc);

        return {
            ...serializedAppointment,
            patientHistory: previousHistoryEntries.map(serializeHistoryEntry),
            patientHistorySummary: {
                totalAppointments: allHistoryEntries.length,
                previousAppointments: previousHistoryEntries.length,
                completedAppointments: allHistoryEntries.filter(
                    (entry) => entry.status === "Completed"
                ).length,
                cancelledAppointments: allHistoryEntries.filter(
                    (entry) => entry.status === "Cancelled"
                ).length,
                lastVisitDate: lastVisitEntry?.appointmentDate || null,
            },
        };
    });
};

const updateAppointmentStatusInStore = async ({
    appointmentId,
    status,
    doctorId,
}) => {
    const validStatuses = [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Completed",
    ];

    if (!validStatuses.includes(status)) {
        return {
            statusCode: 400,
            payload: {
                success: false,
                message: "Invalid appointment status.",
            },
        };
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        return {
            statusCode: 404,
            payload: {
                success: false,
                message: "Appointment not found.",
            },
        };
    }

    if (
        doctorId &&
        appointment.doctorId.toString() !== doctorId.toString()
    ) {
        return {
            statusCode: 403,
            payload: {
                success: false,
                message: "Aap sirf apne appointments update kar sakte hain.",
            },
        };
    }

    appointment.status = status;
    await appointment.save();

    const refreshedAppointment = await Appointment.findById(appointmentId).populate(
        appointmentPopulate
    );
    const [formattedAppointment] = await attachPatientHistory([
        refreshedAppointment,
    ]);

    return {
        statusCode: 200,
        payload: {
            success: true,
            message: "Appointment status updated.",
            appointment: formattedAppointment,
        },
    };
};

export const createAppointment = async (req, res) => {
    try {
        const patientId = resolvePatientId(req);
        const {
            doctorId,
            appointmentDate,
            slotTime,
            symptoms,
            notes,
        } = req.body;

        if (!patientId) {
            return res.status(401).json({
                success: false,
                message: "Patient login required.",
            });
        }

        if (!doctorId || !appointmentDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "Doctor, date aur time required hain.",
            });
        }

        const normalizedDate = normalizeAppointmentDate(appointmentDate);

        if (!normalizedDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date.",
            });
        }

        const [doctorData, patientData] = await Promise.all([
            Doctor.findById(doctorId),
            Patient.findById(patientId),
        ]);

        if (!doctorData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        if (!doctorData.available) {
            return res.status(400).json({
                success: false,
                message: "Doctor is not available right now.",
            });
        }

        if (!patientData) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        const consultationFee = normalizeAmount(doctorData.fee);

        if (consultationFee === null || consultationFee < 0) {
            return res.status(400).json({
                success: false,
                message: "Selected doctor ka consultation fee set nahi hai.",
            });
        }

        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate: normalizedDate,
            slotTime,
            status: { $ne: "Cancelled" },
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Ye slot already booked hai.",
            });
        }

        const appointment = await Appointment.create({
            doctorId,
            patientId,
            appointmentDate: normalizedDate,
            slotTime,
            amount: consultationFee,
            symptoms: symptoms || "",
            notes: notes || "",
        });

        await updatePatientVisitCount(patientId);

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate(appointmentPopulate);
        const [formattedAppointment] = await attachPatientHistory([
            populatedAppointment,
        ]);

        void sendBookingNotifications({
            type: "appointment",
            contactEmail: patientData.email,
            contactPhone: patientData.phone,
            subject: "Appointment booked successfully",
            message: `Dear ${patientData.name}, your appointment with Dr. ${doctorData.name} on ${normalizedDate.toDateString()} at ${slotTime} has been confirmed. Appointment ID: ${appointment._id}.`,
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment: formattedAppointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const bookAppointment = createAppointment;

export const getPatientAppointments = async (req, res) => {
    try {
        const patientId = resolvePatientId(req);

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient id is required.",
            });
        }

        const appointments = await Appointment.find({ patientId })
            .populate(appointmentPopulate)
            .sort({ appointmentDate: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            appointments: appointments.map(serializeAppointment),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate(appointmentPopulate)
            .sort({ createdAt: -1 });

        res.status(200).json(appointments.map(serializeAppointment));
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await updateAppointmentStatusInStore({
            appointmentId: id,
            status,
        });

        res.status(result.statusCode).json(result.payload);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDoctorAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await updateAppointmentStatusInStore({
            appointmentId: id,
            status,
            doctorId: req.doctorId,
        });

        res.status(result.statusCode).json(result.payload);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const cancelPatientAppointment = async (req, res) => {
    try {
        const patientId = resolvePatientId(req);
        const { id } = req.params;

        const appointment = await Appointment.findOne({
            _id: id,
            patientId,
        }).populate(appointmentPopulate);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled hai.",
            });
        }

        if (appointment.status === "Completed") {
            return res.status(400).json({
                success: false,
                message: "Completed appointment cancel nahi ho sakti.",
            });
        }

        if (appointment.paymentStatus) {
            return res.status(400).json({
                success: false,
                message: "Paid appointment cancel karne ke liye support se contact kijiye.",
            });
        }

        appointment.status = "Cancelled";
        await appointment.save();
        await updatePatientVisitCount(patientId);

        const refreshedAppointment = await Appointment.findById(appointment._id)
            .populate(appointmentPopulate);

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully.",
            appointment: serializeAppointment(refreshedAppointment),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const payPatientAppointmentBill = async (req, res) => {
    try {
        const patientId = resolvePatientId(req);
        const { id } = req.params;
        const paymentMethod = normalizePaymentMethod(req.body.paymentMethod);

        if (!patientId) {
            return res.status(401).json({
                success: false,
                message: "Patient login required.",
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Valid payment method select kijiye.",
            });
        }

        const appointment = await Appointment.findOne({
            _id: id,
            patientId,
        });

        if (paymentMethod === "Razorpay") {
            const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

            if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
                return res.status(400).json({
                    success: false,
                    message: "Razorpay payment details required hain.",
                });
            }

            if (
                !verifyRazorpaySignature(
                    razorpayPaymentId,
                    razorpayOrderId,
                    razorpaySignature
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Razorpay signature verify nahi hua.",
                });
            }
        }


        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment bill not found.",
            });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled appointment ka bill pay nahi kiya ja sakta.",
            });
        }

        if (appointment.paymentStatus) {
            return res.status(400).json({
                success: false,
                message: "Is appointment ka payment pehle se ho chuka hai.",
            });
        }

        appointment.paymentStatus = true;
        appointment.paymentMethod = paymentMethod;
        appointment.paymentReference =
            req.body.paymentReference ||
            appointment.paymentReference ||
            buildPaymentReference(appointment._id);
        appointment.paidAt = new Date();

        await appointment.save();

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate(appointmentPopulate);

        res.status(200).json({
            success: true,
            message: "Bill payment successful.",
            appointment: serializeAppointment(populatedAppointment),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        await updatePatientVisitCount(deletedAppointment.patientId);

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.doctorId || req.params.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor id is required.",
            });
        }

        const appointments = await Appointment.find({ doctorId })
            .populate(appointmentPopulate)
            .sort({ appointmentDate: 1, createdAt: -1 });
        const formattedAppointments = await attachPatientHistory(appointments);

        res.status(200).json({
            success: true,
            appointments: formattedAppointments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
