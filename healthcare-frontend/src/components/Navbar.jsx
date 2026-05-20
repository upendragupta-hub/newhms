import React, { useEffect, useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    clearPatientSession,
    getStoredPatient,
    patientAuthEvent,
} from "../utils/patientSession";
import {
    doctorAuthEvent,
    getStoredDoctor,
} from "../utils/doctorSession";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const [patient, setPatient] = useState(getStoredPatient());
    const [doctor, setDoctor] = useState(getStoredDoctor());
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const navLinkStyle = ({ isActive }) =>
        `block w-full rounded-xl px-4 py-2 text-left font-medium transition-all duration-300 md:w-auto md:text-center ${
            isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-(--color-muted) hover:bg-(--color-surface-alt) hover:text-(--color-text)"
        }`;

    useEffect(() => {
        const syncPatient = () => {
            setPatient(getStoredPatient());
        };
        const syncDoctor = () => {
            setDoctor(getStoredDoctor());
        };

        syncPatient();
        syncDoctor();
        window.addEventListener("storage", syncPatient);
        window.addEventListener("storage", syncDoctor);
        window.addEventListener(patientAuthEvent, syncPatient);
        window.addEventListener(doctorAuthEvent, syncDoctor);

        return () => {
            window.removeEventListener("storage", syncPatient);
            window.removeEventListener("storage", syncDoctor);
            window.removeEventListener(patientAuthEvent, syncPatient);
            window.removeEventListener(doctorAuthEvent, syncDoctor);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        clearPatientSession();
        setPatient(null);
        navigate("/patient-login");
    };

    const handleLinkClick = () => {
        if (menuOpen) setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-nav-bg) shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-300">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                    <NavLink to="/" onClick={handleLinkClick}>
                        <img
                            className="h-14 w-14 rounded-full border-2 border-blue-500 object-cover shadow-md"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVgr34LKvZFo-oNxMqkCY2nQrRB5jGQ-cCg&s"
                            alt="Logo"
                        />
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-(--color-text)">
                            MyWebsite
                        </h1>
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-600">
                            Care Platform
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center rounded-xl border border-(--color-border) bg-(--color-surface) p-3 text-(--color-text) transition hover:border-blue-300 md:hidden"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>

                <div className="hidden w-full flex-wrap items-center justify-end gap-3 md:flex">
                    <NavLink to="/" className={navLinkStyle}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={navLinkStyle}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={navLinkStyle}>
                        Contact
                    </NavLink>
                    <NavLink to="/admin" className={navLinkStyle}>
                        Admin login
                    </NavLink>
                    <NavLink
                        to={doctor ? "/doctor-dashboard" : "/doctor-login"}
                        className={navLinkStyle}
                    >
                        {doctor ? "Doctor panel" : "Doctor login"}
                    </NavLink>

                    {patient ? (
                        <>
                            <NavLink to="/my-account" className={navLinkStyle}>
                                My Account
                            </NavLink>
                            <NavLink to="/my-appointments" className={navLinkStyle}>
                                My Panel
                            </NavLink>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl border border-(--color-border) px-4 py-2 font-medium text-(--color-muted) transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={navLinkStyle}>
                                Sign in
                            </NavLink>
                            <NavLink to="/patient-signup" className={navLinkStyle}>
                                Register
                            </NavLink>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-2 font-medium text-(--color-text) transition hover:border-blue-300 hover:text-blue-600"
                        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                    >
                        {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                        <span>{isDarkMode ? "Light" : "Dark"}</span>
                    </button>

                    <NavLink
                        to="/bookdemo"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
                    >
                        Book Demo
                    </NavLink>

                    <NavLink
                        to="/doctors"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
                    >
                        Book Appointment
                    </NavLink>
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? "max-h-screen" : "max-h-0"}`}>
                <div className="flex max-h-screen flex-col gap-2 border-t border-(--color-border) bg-(--color-surface) px-6 py-4">
                    <NavLink to="/" className={navLinkStyle} onClick={handleLinkClick}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={navLinkStyle} onClick={handleLinkClick}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={navLinkStyle} onClick={handleLinkClick}>
                        Contact
                    </NavLink>
                    <NavLink to="/admin" className={navLinkStyle} onClick={handleLinkClick}>
                        Admin login
                    </NavLink>
                    <NavLink
                        to={doctor ? "/doctor-dashboard" : "/doctor-login"}
                        className={navLinkStyle}
                        onClick={handleLinkClick}
                    >
                        {doctor ? "Doctor panel" : "Doctor login"}
                    </NavLink>

                    {patient ? (
                        <>
                            <NavLink to="/my-account" className={navLinkStyle} onClick={handleLinkClick}>
                                My Account
                            </NavLink>
                            <NavLink to="/my-appointments" className={navLinkStyle} onClick={handleLinkClick}>
                                My Panel
                            </NavLink>
                            <button
                                type="button"
                                onClick={() => {
                                    handleLogout();
                                    handleLinkClick();
                                }}
                                className="rounded-xl border border-(--color-border) px-4 py-2 font-medium text-(--color-muted) transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 text-left w-full"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={navLinkStyle} onClick={handleLinkClick}>
                                Sign in
                            </NavLink>
                            <NavLink to="/patient-signup" className={navLinkStyle} onClick={handleLinkClick}>
                                Register
                            </NavLink>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            toggleTheme();
                            handleLinkClick();
                        }}
                        className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-2 font-medium text-(--color-text) transition hover:border-blue-300 hover:text-blue-600"
                        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                    >
                        {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                        <span>{isDarkMode ? "Light" : "Dark"}</span>
                    </button>

                    <NavLink
                        to="/bookdemo"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
                        onClick={handleLinkClick}
                    >
                        Book Demo
                    </NavLink>

                    <NavLink
                        to="/doctors"
                        className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700"
                        onClick={handleLinkClick}
                    >
                        Book Appointment
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
