import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import {
    clearDoctorSession,
    getDoctorAuthHeaders,
    getDoctorToken,
    getStoredDoctor,
    setDoctorSession,
} from "../utils/doctorSession";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const token = getDoctorToken();
    const [doctor, setDoctor] = useState(getStoredDoctor());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [profileData, setProfileData] = useState({
        name: "",
        specialization: "",
        experience: "",
        fee: "",
        image: "",
        email: "",
        phone: "",
        available: "true",
    });

    const formatDate = (value) =>
        new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeZone: "UTC",
        }).format(new Date(value));

    useEffect(() => {
        if (!token) {
            navigate("/doctor-login");
            return;
        }

        fetchDashboard();
    }, [token]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const [doctorResponse, appointmentsResponse] = await Promise.all([
                axios.get("https://newhms.onrender.com/api/doctors/me", {
                    headers: getDoctorAuthHeaders(),
                }),
                axios.get(
                    "https://newhms.onrender.com/api/appointments/doctor/my-appointments",
                    {
                        headers: getDoctorAuthHeaders(),
                    }
                ),
            ]);

            if (doctorResponse.data.success) {
                setDoctor(doctorResponse.data.doctor);
                setProfileData({
                    name: doctorResponse.data.doctor.name || "",
                    specialization: doctorResponse.data.doctor.specialization || "",
                    experience: doctorResponse.data.doctor.experience?.toString() || "",
                    fee: doctorResponse.data.doctor.fee?.toString() || "",
                    image: doctorResponse.data.doctor.image || "",
                    email: doctorResponse.data.doctor.email || "",
                    phone: doctorResponse.data.doctor.phone || "",
                    available:
                        doctorResponse.data.doctor.available === false
                            ? "false"
                            : "true",
                });
                setDoctorSession({
                    token,
                    doctor: doctorResponse.data.doctor,
                });
            }

            if (appointmentsResponse.data.success) {
                setAppointments(appointmentsResponse.data.appointments);
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Doctor dashboard load nahi ho pa raha."
            );

            if (error.response?.status === 401) {
                clearDoctorSession();
                navigate("/doctor-login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearDoctorSession();
        navigate("/doctor-login");
    };

    const handleStatusUpdate = async (appointmentId, nextStatus) => {
        try {
            setUpdatingId(appointmentId);

            const response = await axios.put(
                `https://newhms.onrender.com/api/appointments/doctor/status/${appointmentId}`,
                { status: nextStatus },
                {
                    headers: getDoctorAuthHeaders(),
                }
            );

            if (response.data.success) {
                setAppointments((currentAppointments) =>
                    currentAppointments.map((item) =>
                        item._id === appointmentId
                            ? response.data.appointment
                            : item
                    )
                );
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Status update nahi ho pa raha."
            );
        } finally {
            setUpdatingId("");
        }
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                ...profileData,
                experience: Number(profileData.experience),
                fee: Number(profileData.fee),
                available: profileData.available === "true",
            };

            const response = await API.put(
                "/doctors/me",
                payload,
                {
                    headers: getDoctorAuthHeaders(),
                }
            );

            if (response.data.success) {
                setDoctor(response.data.doctor);
                setDoctorSession({
                    token,
                    doctor: response.data.doctor,
                });
                setProfileData({
                    name: response.data.doctor.name || "",
                    specialization: response.data.doctor.specialization || "",
                    experience: response.data.doctor.experience?.toString() || "",
                    fee: response.data.doctor.fee?.toString() || "",
                    image: response.data.doctor.image || "",
                    email: response.data.doctor.email || "",
                    phone: response.data.doctor.phone || "",
                    available:
                        response.data.doctor.available === false
                            ? "false"
                            : "true",
                });
                alert(response.data.message || "Profile updated successfully.");
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Profile update nahi ho pa raha."
            );
        }
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">
                    Loading doctor dashboard...
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                    <h2 className="text-xl font-bold">Dashboard unavailable</h2>
                    <p className="mt-2 text-sm">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={fetchDashboard}
                        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const uniquePatients = new Set(
        appointments
            .map((item) => item.patientProfile?._id || item.patient?._id)
            .filter(Boolean)
    ).size;
    const pendingAppointments = appointments.filter(
        (item) => item.status === "Pending"
    ).length;
    const completedAppointments = appointments.filter(
        (item) => item.status === "Completed"
    ).length;

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="space-y-6">
                <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-700 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                                Doctor dashboard
                            </p>
                            <h1 className="text-3xl font-bold">
                                Dr. {doctor?.name || "Doctor"}
                            </h1>
                            <p className="max-w-2xl text-sm text-blue-100">
                                {doctor?.specialization || "Specialist"} panel
                                with live bookings, patient details, aur previous
                                history.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={fetchDashboard}
                                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                Refresh
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total bookings</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {appointments.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Unique patients</p>
                        <p className="mt-3 text-3xl font-bold text-blue-600">
                            {uniquePatients}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Completed visits</p>
                        <p className="mt-3 text-3xl font-bold text-emerald-600">
                            {completedAppointments}
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Update your profile
                            </h2>
                            <p className="text-sm text-slate-500">
                                Doctor profile details ko edit karein.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-700">
                            Name
                            <input
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Specialization
                            <input
                                name="specialization"
                                value={profileData.specialization}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Experience (years)
                            <input
                                name="experience"
                                type="number"
                                min="0"
                                value={profileData.experience}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Fee
                            <input
                                name="fee"
                                type="number"
                                min="0"
                                value={profileData.fee}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Image URL
                            <input
                                name="image"
                                value={profileData.image}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Email
                            <input
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Phone
                            <input
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700">
                            Availability
                            <select
                                name="available"
                                value={profileData.available}
                                onChange={handleProfileChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>
                        </label>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Appointments and patient history
                            </h2>
                            <p className="text-sm text-slate-500">
                                Har booking ke saath patient ka profile aur uski
                                previous appointments yahin dikhenge.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Pending approvals:{" "}
                            <span className="font-semibold text-slate-900">
                                {pendingAppointments}
                            </span>
                        </div>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                            <h3 className="text-xl font-semibold text-slate-900">
                                No appointments yet
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Jaise hi koi patient aapko book karega, uski
                                details aur history yahin show hogi.
                            </p>
                            <Link
                                to="/doctor-login"
                                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Back to doctor login
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {appointments.map((appointment) => {
                                const patient = appointment.patientProfile;
                                const statusClasses = {
                                    Pending:
                                        "border-amber-200 bg-amber-50 text-amber-700",
                                    Confirmed:
                                        "border-blue-200 bg-blue-50 text-blue-700",
                                    Cancelled:
                                        "border-rose-200 bg-rose-50 text-rose-700",
                                    Completed:
                                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                                };

                                return (
                                    <article
                                        key={appointment._id}
                                        className="rounded-3xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-2xl font-semibold text-slate-900">
                                                        {patient?.name || appointment.patientName}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                                                            statusClasses[
                                                                appointment.status
                                                            ] ||
                                                            "border-slate-200 bg-slate-100 text-slate-700"
                                                        }`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </div>

                                                <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-3">
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Appointment date:
                                                        </span>{" "}
                                                        {formatDate(
                                                            appointment.appointmentDate
                                                        )}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Slot:
                                                        </span>{" "}
                                                        {appointment.slotTime}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Phone:
                                                        </span>{" "}
                                                        {patient?.phone || "Not added"}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Email:
                                                        </span>{" "}
                                                        {patient?.email || "Not added"}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Gender / Age:
                                                        </span>{" "}
                                                        {patient?.gender || "Not added"} /{" "}
                                                        {patient?.age || "Not added"}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-900">
                                                            Total visits:
                                                        </span>{" "}
                                                        {
                                                            appointment
                                                                .patientHistorySummary
                                                                ?.totalAppointments
                                                        }
                                                    </p>
                                                </div>

                                                {patient?.address ? (
                                                    <p className="text-sm text-slate-600">
                                                        <span className="font-semibold text-slate-900">
                                                            Address:
                                                        </span>{" "}
                                                        {patient.address}
                                                    </p>
                                                ) : null}

                                                {appointment.symptoms ? (
                                                    <p className="text-sm text-slate-600">
                                                        <span className="font-semibold text-slate-900">
                                                            Current symptoms:
                                                        </span>{" "}
                                                        {appointment.symptoms}
                                                    </p>
                                                ) : null}

                                                {appointment.notes ? (
                                                    <p className="text-sm text-slate-600">
                                                        <span className="font-semibold text-slate-900">
                                                            Notes:
                                                        </span>{" "}
                                                        {appointment.notes}
                                                    </p>
                                                ) : null}
                                            </div>

                                            <div className="flex flex-col gap-3 xl:min-w-[220px] xl:items-end">
                                                {appointment.status === "Pending" ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    appointment._id,
                                                                    "Confirmed"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                appointment._id
                                                            }
                                                            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    appointment._id,
                                                                    "Cancelled"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                appointment._id
                                                            }
                                                            className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : null}

                                                {appointment.status === "Confirmed" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                appointment._id,
                                                                "Completed"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            appointment._id
                                                        }
                                                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                                                    >
                                                        Mark completed
                                                    </button>
                                                ) : null}

                                                {appointment.status === "Completed" ||
                                                appointment.status ===
                                                    "Cancelled" ? (
                                                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                                        No pending action.
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-slate-900">
                                                        Patient history
                                                    </h4>
                                                    <p className="text-sm text-slate-500">
                                                        Previous visits:{" "}
                                                        <span className="font-semibold text-slate-900">
                                                            {
                                                                appointment
                                                                    .patientHistorySummary
                                                                    ?.previousAppointments
                                                            }
                                                        </span>
                                                        {appointment
                                                            .patientHistorySummary
                                                            ?.lastVisitDate
                                                            ? ` | Last visit: ${formatDate(
                                                                  appointment
                                                                      .patientHistorySummary
                                                                      .lastVisitDate
                                                              )}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            {appointment.patientHistory?.length ? (
                                                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                                                    {appointment.patientHistory.map(
                                                        (historyItem) => (
                                                            <div
                                                                key={historyItem._id}
                                                                className="rounded-2xl border border-slate-200 bg-white p-4"
                                                            >
                                                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                                    <div className="space-y-1 text-sm text-slate-600">
                                                                        <p>
                                                                            <span className="font-semibold text-slate-900">
                                                                                Date:
                                                                            </span>{" "}
                                                                            {formatDate(
                                                                                historyItem.appointmentDate
                                                                            )}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold text-slate-900">
                                                                                Slot:
                                                                            </span>{" "}
                                                                            {historyItem.slotTime}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold text-slate-900">
                                                                                Doctor:
                                                                            </span>{" "}
                                                                            Dr.{" "}
                                                                            {historyItem.doctor?.name ||
                                                                                "N/A"}
                                                                            {historyItem
                                                                                .doctor
                                                                                ?.specialization
                                                                                ? ` (${historyItem.doctor.specialization})`
                                                                                : ""}
                                                                        </p>
                                                                        {historyItem.symptoms ? (
                                                                            <p>
                                                                                <span className="font-semibold text-slate-900">
                                                                                    Symptoms:
                                                                                </span>{" "}
                                                                                {historyItem.symptoms}
                                                                            </p>
                                                                        ) : null}
                                                                        {historyItem.notes ? (
                                                                            <p>
                                                                                <span className="font-semibold text-slate-900">
                                                                                    Notes:
                                                                                </span>{" "}
                                                                                {historyItem.notes}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>

                                                                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                                        {historyItem.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                                                    Is patient ki koi previous
                                                    appointment history abhi
                                                    available nahi hai.
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default DoctorDashboard;
