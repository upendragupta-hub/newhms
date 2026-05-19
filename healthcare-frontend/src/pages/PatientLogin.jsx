import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setPatientSession } from "../utils/patientSession";

const PatientLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const res = await axios.post(
                "https://newhms.onrender.com/api/patients/login",
                {
                    email,
                    password,
                }
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
                    "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            >
                <div className="space-y-2 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                        Patient Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Login to your panel
                    </h1>
                    <p className="text-sm text-slate-500">
                        Apni appointments aur profile details dekhne ke liye login
                        karein.
                    </p>
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMessage ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errorMessage}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-sm text-slate-500">
                    New patient?{" "}
                    <Link to="/patient-signup" className="font-semibold text-blue-600">
                        Create account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default PatientLogin;
