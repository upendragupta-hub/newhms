import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    clearDoctorSession,
    getStoredDoctor,
    setDoctorSession,
} from "../utils/doctorSession";

const DoctorAuth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [doctor, setDoctor] = useState(getStoredDoctor());
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        specialization: "",
        experience: "",
        fee: "",
        phone: "",
        image: "",
    });

    const handleChange = (event) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const endpoint = isLogin
                ? "https://newhms.onrender.com/api/doctors/login"
                : "https://newhms.onrender.com/api/doctors/register";
            const payload = isLogin
                ? {
                      email: formData.email,
                      password: formData.password,
                  }
                : formData;

            const response = await axios.post(endpoint, payload);

            if (response.data.success) {
                setDoctorSession({
                    token: response.data.token,
                    doctor: response.data.doctor,
                });
                setDoctor(response.data.doctor);
                navigate("/doctor-dashboard");
            }
        } catch (error) {
            alert(
                error.response?.data?.message || "Doctor login failed."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        clearDoctorSession();
        setDoctor(null);
    };

    if (doctor) {
        return (
            <section className="mx-auto my-10 max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                            Doctor Access
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Welcome back, Dr. {doctor.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Aap apne dashboard se appointments aur patient
                            history dono manage kar sakte hain.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/doctor-dashboard")}
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Open dashboard
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto my-10 max-w-5xl px-4">
            <div className="grid gap-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
                <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 p-8 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                        Doctor Portal
                    </p>
                    <h2 className="mt-4 text-4xl font-bold leading-tight">
                        Patients ki booking aur unki history ek hi jagah.
                    </h2>
                    <p className="mt-4 max-w-lg text-sm text-blue-100">
                        Login ke baad doctor dashboard me har patient ka profile,
                        symptoms aur previous appointment history mil jayegi.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-8">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {isLogin ? "Doctor login" : "Doctor register"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            {isLogin
                                ? "Apna panel open karne ke liye sign in kijiye."
                                : "Naya doctor account create kijiye."}
                        </p>
                    </div>

                    {!isLogin ? (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Doctor name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                required
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    type="text"
                                    name="specialization"
                                    placeholder="Specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    name="experience"
                                    placeholder="Experience (years)"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    type="number"
                                    name="fee"
                                    placeholder="Consultation fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                />
                            </div>
                            <input
                                type="url"
                                name="image"
                                placeholder="Profile image URL"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                            />
                        </>
                    ) : null}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {submitting
                            ? "Please wait..."
                            : isLogin
                              ? "Login"
                              : "Register"}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        {isLogin
                            ? "Don't have a doctor account?"
                            : "Already have a doctor account?"}{" "}
                        <button
                            type="button"
                            onClick={() => setIsLogin((current) => !current)}
                            className="font-semibold text-blue-600"
                        >
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default DoctorAuth;
