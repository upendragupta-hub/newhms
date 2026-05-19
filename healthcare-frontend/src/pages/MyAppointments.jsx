import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    clearPatientSession,
    getPatientAuthHeaders,
    getPatientToken,
    getStoredPatient,
    setPatientSession,
} from "../utils/patientSession";

const PAYMENT_OPTIONS = ["UPI", "Card", "NetBanking", "Wallet", "Cash", "Razorpay"];

const MyAppointments = () => {
    const navigate = useNavigate();
    const token = getPatientToken();
    const [patient, setPatient] = useState(getStoredPatient());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [cancellingId, setCancellingId] = useState("");
    const [payingId, setPayingId] = useState("");
    const [activeBillId, setActiveBillId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState({});

    const formatDate = (value) =>
        new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeZone: "UTC",
        }).format(new Date(value));

    const formatDateTime = (value) =>
        new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(value) || 0);

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                )
            ) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleRazorpayPayment = async (appointmentId) => {
        try {
            setPayingId(appointmentId);
            setErrorMessage("");

            const response = await axios.post(
                `https://newhms.onrender.com/api/appointments/${appointmentId}/razorpay-order`,
                {},
                {
                    headers: getPatientAuthHeaders(),
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Razorpay order create fail hua.");
            }

            const order = response.data.order;
            const key = response.data.key;
            const isLoaded = await loadRazorpayScript();

            if (!isLoaded) {
                throw new Error("Razorpay checkout script load nahi hua.");
            }

            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "Healthcare HMS",
                description: "Appointment payment",
                order_id: order.id,
                modal: {
                    ondismiss: function () {
                        setPayingId("");
                    },
                },
                handler: async function (razorpayResponse) {
                    try {
                        const paymentConfirm = await axios.patch(
                            `https://newhms.onrender.com/api/appointments/${appointmentId}/pay`,
                            {
                                paymentMethod: "Razorpay",
                                paymentReference: razorpayResponse.razorpay_payment_id,
                                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                                razorpayOrderId: razorpayResponse.razorpay_order_id,
                                razorpaySignature: razorpayResponse.razorpay_signature,
                            },
                            {
                                headers: getPatientAuthHeaders(),
                            }
                        );

                        if (paymentConfirm.data.success) {
                            setAppointments((currentAppointments) =>
                                currentAppointments.map((item) =>
                                    item._id === appointmentId
                                        ? paymentConfirm.data.appointment
                                        : item
                                )
                            );
                            setActiveBillId("");
                        } else {
                            setErrorMessage(
                                paymentConfirm.data.message ||
                                    "Payment confirm nahi ho paya."
                            );
                        }
                    } catch (error) {
                        setErrorMessage(
                            error.response?.data?.message ||
                                error.message ||
                                "Payment verify nahi ho paya."
                        );
                    } finally {
                        setPayingId("");
                    }
                },
                prefill: {
                    name: patient?.name || "",
                    email: patient?.email || "",
                    contact: patient?.phone || "",
                },
                theme: {
                    color: "#2563eb",
                },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || error.message || "Razorpay payment failed."
            );
            setPayingId("");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/patient-login");
            return;
        }

        fetchAppointments();
    }, [token]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const [profileResponse, appointmentsResponse] = await Promise.all([
                axios.get("https://newhms.onrender.com/api/patients/me", {
                    headers: getPatientAuthHeaders(),
                }),
                axios.get("https://newhms.onrender.com/api/appointments/my-appointments", {
                    headers: getPatientAuthHeaders(),
                }),
            ]);

            if (profileResponse.data.success) {
                setPatient(profileResponse.data.patient);
                setPatientSession({
                    token,
                    patient: profileResponse.data.patient,
                });
            }

            if (appointmentsResponse.data.success) {
                setAppointments(appointmentsResponse.data.appointments);
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Appointments load nahi ho pa rahe."
            );

            if (error.response?.status === 401) {
                clearPatientSession();
                navigate("/patient-login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearPatientSession();
        navigate("/patient-login");
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            setCancellingId(appointmentId);
            setErrorMessage("");

            const response = await axios.patch(
                `https://newhms.onrender.com/api/appointments/${appointmentId}/cancel`,
                {},
                {
                    headers: getPatientAuthHeaders(),
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
                setActiveBillId((currentId) =>
                    currentId === appointmentId ? "" : currentId
                );
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Appointment cancel nahi ho pa raha."
            );
        } finally {
            setCancellingId("");
        }
    };

    const handlePaymentMethodChange = (appointmentId, paymentMethod) => {
        setPaymentMethods((currentMethods) => ({
            ...currentMethods,
            [appointmentId]: paymentMethod,
        }));
    };

    const handlePayBill = async (appointmentId) => {
        const selectedMethod = paymentMethods[appointmentId] || "UPI";

        if (selectedMethod === "Razorpay") {
            await handleRazorpayPayment(appointmentId);
            return;
        }

        try {
            setPayingId(appointmentId);
            setErrorMessage("");

            const response = await axios.patch(
                `https://newhms.onrender.com/api/appointments/${appointmentId}/pay`,
                {
                    paymentMethod: selectedMethod,
                },
                {
                    headers: getPatientAuthHeaders(),
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
                setActiveBillId("");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Bill payment process fail ho gaya."
            );
        } finally {
            setPayingId("");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-10">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">
                    Loading your patient panel...
                </div>
            </div>
        );
    }

    const upcomingAppointments = appointments.filter(
        (item) => item.status !== "Cancelled" && item.status !== "Completed"
    );

    const completedAppointments = appointments.filter(
        (item) => item.status === "Completed"
    );

    const cancelledAppointments = appointments.filter(
        (item) => item.status === "Cancelled"
    );

    const payableAppointments = appointments.filter(
        (item) => !item.paymentStatus && item.status !== "Cancelled"
    );

    const paidAppointments = appointments.filter((item) => item.paymentStatus);

    const outstandingAmount = payableAppointments.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );

    const totalPaidAmount = paidAppointments.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );

    const nextAppointment = [...upcomingAppointments].sort(
        (left, right) =>
            new Date(left.appointmentDate) - new Date(right.appointmentDate)
    )[0];

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <div className="space-y-6">
                    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-8 text-white shadow-2xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3">
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                                    Patient Panel
                                </p>
                                <h1 className="text-3xl font-bold">
                                    Welcome back{patient?.name ? `, ${patient.name}` : ""}
                                </h1>
                                <p className="max-w-2xl text-sm text-blue-100">
                                    Yahan se aap apne appointments dekh sakte hain, status
                                    track kar sakte hain, bill check kar sakte hain aur
                                    payment confirm bhi kar sakte hain.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/book-appointment"
                                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                >
                                    Book new appointment
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total appointments</p>
                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {appointments.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Active bookings</p>
                            <p className="mt-3 text-3xl font-bold text-blue-600">
                                {upcomingAppointments.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Paid bills</p>
                            <p className="mt-3 text-3xl font-bold text-emerald-600">
                                {paidAppointments.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Outstanding amount</p>
                            <p className="mt-3 text-3xl font-bold text-amber-600">
                                {formatCurrency(outstandingAmount)}
                            </p>
                        </div>
                    </section>

                    {errorMessage ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {errorMessage}
                        </div>
                    ) : null}

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    My appointments and bills
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Har booking ke saath uska bill aur payment status
                                    yahin available hai.
                                </p>
                            </div>
                            <Link
                                to="/book-appointment"
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
                            >
                                Add appointment
                            </Link>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    No appointments yet
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Pehla appointment book kijiye, phir yahin par uska
                                    bill, status aur payment details dikh jayengi.
                                </p>
                                <Link
                                    to="/book-appointment"
                                    className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Book your first appointment
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map((item) => {
                                    const statusClasses = {
                                        Pending:
                                            "border-amber-200 bg-amber-50 text-amber-700",
                                        Confirmed:
                                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                                        Cancelled:
                                            "border-rose-200 bg-rose-50 text-rose-700",
                                        Completed:
                                            "border-slate-200 bg-slate-100 text-slate-700",
                                    };
                                    const billStatusClasses = {
                                        Pending:
                                            "border-amber-200 bg-amber-50 text-amber-700",
                                        Paid:
                                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                                        Cancelled:
                                            "border-slate-200 bg-slate-100 text-slate-700",
                                        "Refund pending":
                                            "border-rose-200 bg-rose-50 text-rose-700",
                                    };
                                    const isBillPayable =
                                        !item.paymentStatus &&
                                        item.status !== "Cancelled";

                                    return (
                                        <article
                                            key={item._id}
                                            className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex gap-4">
                                                    <img
                                                        src={
                                                            item.doctor?.image ||
                                                            "https://via.placeholder.com/120"
                                                        }
                                                        alt={item.doctor?.name || "Doctor"}
                                                        className="h-24 w-24 rounded-2xl object-cover"
                                                    />

                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-slate-900">
                                                            Dr. {item.doctor?.name || "Doctor"}
                                                        </h3>
                                                        <p className="text-sm text-slate-500">
                                                            {item.doctor?.specialization ||
                                                                "Specialist"}
                                                        </p>
                                                        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Date:
                                                                </span>{" "}
                                                                {formatDate(item.appointmentDate)}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Time:
                                                                </span>{" "}
                                                                {item.slotTime}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Fee:
                                                                </span>{" "}
                                                                {formatCurrency(item.amount)}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Payment:
                                                                </span>{" "}
                                                                {item.paymentStatus ? "Paid" : "Pending"}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Bill no:
                                                                </span>{" "}
                                                                {item.bill?.number || "Not generated"}
                                                            </p>
                                                            <p>
                                                                <span className="font-semibold text-slate-900">
                                                                    Bill status:
                                                                </span>{" "}
                                                                {item.bill?.status || "Pending"}
                                                            </p>
                                                        </div>
                                                        {item.bill?.paidAt ? (
                                                            <p className="text-sm text-slate-600">
                                                                <span className="font-semibold text-slate-900">
                                                                    Paid on:
                                                                </span>{" "}
                                                                {formatDateTime(item.bill.paidAt)}
                                                                {item.bill?.paymentMethod
                                                                    ? ` via ${item.bill.paymentMethod}`
                                                                    : ""}
                                                            </p>
                                                        ) : null}
                                                        {item.bill?.paymentReference ? (
                                                            <p className="text-sm text-slate-600">
                                                                <span className="font-semibold text-slate-900">
                                                                    Payment ref:
                                                                </span>{" "}
                                                                {item.bill.paymentReference}
                                                            </p>
                                                        ) : null}
                                                        {item.symptoms ? (
                                                            <p className="text-sm text-slate-600">
                                                                <span className="font-semibold text-slate-900">
                                                                    Symptoms:
                                                                </span>{" "}
                                                                {item.symptoms}
                                                            </p>
                                                        ) : null}
                                                        {item.notes ? (
                                                            <p className="text-sm text-slate-600">
                                                                <span className="font-semibold text-slate-900">
                                                                    Notes:
                                                                </span>{" "}
                                                                {item.notes}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 lg:items-end">
                                                    <span
                                                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                                                            statusClasses[item.status] ||
                                                            "border-slate-200 bg-slate-50 text-slate-700"
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>

                                                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 lg:w-[240px]">
                                                        <p className="font-semibold text-slate-900">
                                                            {item.bill?.number || "Appointment bill"}
                                                        </p>
                                                        <p className="mt-1">
                                                            Amount:{" "}
                                                            <span className="font-semibold text-slate-900">
                                                                {formatCurrency(
                                                                    item.bill?.amount ?? item.amount
                                                                )}
                                                            </span>
                                                        </p>
                                                        <p className="mt-1">
                                                            Due on:{" "}
                                                            <span className="font-semibold text-slate-900">
                                                                {formatDate(
                                                                    item.bill?.dueDate ||
                                                                        item.appointmentDate
                                                                )}
                                                            </span>
                                                        </p>
                                                        <span
                                                            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                                                billStatusClasses[
                                                                    item.bill?.status
                                                                ] ||
                                                                "border-slate-200 bg-white text-slate-700"
                                                            }`}
                                                        >
                                                            {item.bill?.status || "Pending"}
                                                        </span>
                                                    </div>

                                                    {isBillPayable ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveBillId((currentId) =>
                                                                    currentId === item._id
                                                                        ? ""
                                                                        : item._id
                                                                )
                                                            }
                                                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                        >
                                                            {activeBillId === item._id
                                                                ? "Hide payment"
                                                                : "Pay now"}
                                                        </button>
                                                    ) : null}

                                                    {(item.status === "Pending" ||
                                                        item.status === "Confirmed") &&
                                                    !item.paymentStatus ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCancelAppointment(item._id)
                                                            }
                                                            disabled={cancellingId === item._id}
                                                            className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {cancellingId === item._id
                                                                ? "Cancelling..."
                                                                : "Cancel appointment"}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {activeBillId === item._id && isBillPayable ? (
                                                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                                                                Bill payment
                                                            </p>
                                                            <h4 className="mt-1 text-lg font-semibold text-slate-900">
                                                                {item.bill?.number}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-slate-600">
                                                                Amount to pay:{" "}
                                                                <span className="font-semibold text-slate-900">
                                                                    {formatCurrency(item.amount)}
                                                                </span>
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Payment method choose karke bill ko
                                                                paid mark kijiye.
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                                Payment method
                                                                <select
                                                                    value={
                                                                        paymentMethods[item._id] ||
                                                                        "UPI"
                                                                    }
                                                                    onChange={(event) =>
                                                                        handlePaymentMethodChange(
                                                                            item._id,
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                                                                >
                                                                    {PAYMENT_OPTIONS.map(
                                                                        (option) => (
                                                                            <option
                                                                                key={option}
                                                                                value={option}
                                                                            >
                                                                                {option}
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </label>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePayBill(item._id)
                                                                }
                                                                disabled={payingId === item._id}
                                                                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                                                            >
                                                                {payingId === item._id
                                                                    ? "Processing..."
                                                                    : "Confirm payment"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Profile summary
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                <span className="font-semibold text-slate-900">Name:</span>{" "}
                                {patient?.name || "Not added"}
                            </p>
                            <p>
                                <span className="font-semibold text-slate-900">Email:</span>{" "}
                                {patient?.email || "Not added"}
                            </p>
                            <p>
                                <span className="font-semibold text-slate-900">Phone:</span>{" "}
                                {patient?.phone || "Not added"}
                            </p>
                            <p>
                                <span className="font-semibold text-slate-900">Gender:</span>{" "}
                                {patient?.gender || "Not added"}
                            </p>
                            <p>
                                <span className="font-semibold text-slate-900">Age:</span>{" "}
                                {patient?.age || "Not added"}
                            </p>
                            <p>
                                <span className="font-semibold text-slate-900">
                                    Address:
                                </span>{" "}
                                {patient?.address || "Not added"}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Billing summary
                        </h2>
                        <div className="mt-4 space-y-4 text-sm text-slate-600">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="font-semibold text-slate-900">
                                    Outstanding bills
                                </p>
                                <p className="mt-2 text-2xl font-bold text-amber-600">
                                    {payableAppointments.length}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Total due: {formatCurrency(outstandingAmount)}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="font-semibold text-slate-900">
                                    Total paid amount
                                </p>
                                <p className="mt-2 text-2xl font-bold text-emerald-600">
                                    {formatCurrency(totalPaidAmount)}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Paid bills: {paidAppointments.length}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="font-semibold text-slate-900">
                                    Next appointment
                                </p>
                                {nextAppointment ? (
                                    <div className="mt-2 space-y-1">
                                        <p>Dr. {nextAppointment.doctor?.name}</p>
                                        <p>
                                            {formatDate(nextAppointment.appointmentDate)} at{" "}
                                            {nextAppointment.slotTime}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-slate-500">
                                        No active appointment scheduled.
                                    </p>
                                )}
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="font-semibold text-slate-900">
                                    Visit summary
                                </p>
                                <p className="mt-2 text-slate-500">
                                    Completed visits:{" "}
                                    <span className="font-semibold text-slate-900">
                                        {completedAppointments.length}
                                    </span>
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Cancelled appointments:{" "}
                                    <span className="font-semibold text-slate-900">
                                        {cancelledAppointments.length}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Bill help
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                Har appointment ke saath bill number automatically
                                generate ho raha hai.
                            </p>
                            <p>
                                Payment hone ke baad reference aur paid time card par
                                show hoga.
                            </p>
                            <p>
                                Cancelled appointment ke unpaid bills inactive ho jaate
                                hain.
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default MyAppointments;
