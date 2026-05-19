import React from "react";
import { Link } from "react-router-dom";
import { getStoredPatient } from "../utils/patientSession";

const Login = () => {
    const patient = getStoredPatient();

    return (
        <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-4 py-10">
            <div className="grid w-full gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-8 text-white shadow-2xl sm:p-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                        User Access
                    </p>
                    <h1 className="mt-4 text-4xl font-bold leading-tight">
                        Patient panel se appointments ko easily manage kijiye
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
                        Login karne ke baad aap apna appointment status dekh sakte hain,
                        naya slot book kar sakte hain aur pending appointment cancel bhi
                        kar sakte hain.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to={patient ? "/my-appointments" : "/patient-login"}
                            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            {patient ? "Open my panel" : "Patient login"}
                        </Link>
                        <Link
                            to="/patient-signup"
                            className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold text-slate-900">
                        What you can do
                    </h2>
                    <div className="mt-6 space-y-4 text-sm text-slate-600">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">
                                View appointments
                            </p>
                            <p className="mt-2">
                                Saare booked appointments date, time aur doctor details ke
                                saath ek hi jagah.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">
                                Track status
                            </p>
                            <p className="mt-2">
                                Pending, confirmed, completed aur cancelled states clearly
                                dikhengi.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">
                                Manage bookings
                            </p>
                            <p className="mt-2">
                                Panel se direct naya appointment book karein ya zarurat par
                                cancel karein.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
