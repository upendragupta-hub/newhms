import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setPatientSession } from "../utils/patientSession";

const PatientSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        age: "",
        address: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            const res = await axios.post(
                "https://newhms.onrender.com/api/patients/register",
                formData
            );

            if (res.data.success) {
                setPatientSession({
                    token: res.data.token,
                    patient: res.data.patient,
                });
                navigate("/my-appointments");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Signup failed. Please try again."
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
                        Patient Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Create your account
                    </h1>
                    <p className="text-sm text-slate-500">
                        Register karke aap apne appointments book, track aur manage kar
                        sakte hain.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="gender"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>

                <textarea
                    name="address"
                    placeholder="Address"
                    className="min-h-28 w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={formData.address}
                    onChange={handleChange}
                />

                {errorMessage ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errorMessage}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {submitting ? "Creating account..." : "Create account"}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Already registered?{" "}
                    <Link to="/patient-login" className="font-semibold text-blue-600">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default PatientSignup;
