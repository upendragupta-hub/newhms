import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
    getPatientAuthHeaders,
    getPatientToken,
} from "../utils/patientSession";

const BookAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = getPatientToken();
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        doctorId: location.state?.doctorId || "",
        appointmentDate: "",
        slotTime: "",
        symptoms: "",
        notes: "",
    });

    const hasValidFee = (doctor) => Number.isFinite(Number(doctor?.fee));

    useEffect(() => {
        if (!token) {
            navigate("/patient-login");
            return;
        }

        fetchDoctors();
    }, [token]);

    const fetchDoctors = async () => {
        try {
            setLoadingDoctors(true);
            const response = await API.get("/doctors/get");
            setDoctors(response.data || []);
        } catch (error) {
            setErrorMessage("Doctors list load nahi ho rahi.");
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage("");

        try {
            const response = await API.post(
                "/appointments/book",
                formData,
                {
                    headers: getPatientAuthHeaders(),
                }
            );

            if (response.data.success) {
                navigate("/my-appointments");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Appointment book nahi ho pa raha."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <div className="space-y-2 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                        New Booking
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Book an appointment
                    </h1>
                    <p className="text-sm text-slate-500">
                        Doctor select kijiye aur apna preferred date-time slot book
                        kijiye.
                    </p>
                </div>

                <select
                    name="doctorId"
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={formData.doctorId}
                    onChange={handleChange}
                    disabled={loadingDoctors}
                    required
                >
                    <option value="">
                        {loadingDoctors ? "Loading doctors..." : "Select doctor"}
                    </option>
                    {doctors.map((doctor) => (
                        <option
                            key={doctor._id}
                            value={doctor._id}
                            disabled={!hasValidFee(doctor)}
                        >
                            Dr. {doctor.name} - {doctor.specialization}
                            {hasValidFee(doctor)
                                ? ` (Rs. ${doctor.fee})`
                                : " (Fee not set)"}
                        </option>
                    ))}
                </select>

                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        type="date"
                        name="appointmentDate"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="slotTime"
                        placeholder="Example: 10:00 AM - 10:30 AM"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.slotTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <textarea
                    name="symptoms"
                    placeholder="Symptoms"
                    className="min-h-28 w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={formData.symptoms}
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    placeholder="Additional notes"
                    className="min-h-24 w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={formData.notes}
                    onChange={handleChange}
                />

                {errorMessage ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {submitting ? "Booking..." : "Book appointment"}
                    </button>

                    <Link
                        to="/my-appointments"
                        className="flex-1 rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
                    >
                        Back to panel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default BookAppointment;
