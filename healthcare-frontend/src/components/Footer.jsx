import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
    const footerLinkStyle =
        "text-[var(--color-footer-muted)] transition duration-300 hover:text-white";

    return (
        <footer className="mt-20 bg-[var(--color-footer-bg)] pt-14 pb-8 text-white transition-colors duration-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
                <div>
                    <div className="mb-5 flex items-center gap-3">
                        <img
                            className="h-14 w-14 rounded-full border-2 border-white object-cover"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVgr34LKvZFo-oNxMqkCY2nQrRB5jGQ-cCg&s"
                            alt="Logo"
                        />

                        <h1 className="text-3xl font-bold">MyWebsite</h1>
                    </div>

                    <p className="leading-7 text-[var(--color-footer-muted)]">
                        We provide trusted healthcare services with experienced
                        doctors, modern technology, and patient-focused treatment.
                    </p>
                </div>

                <div>
                    <h2 className="mb-5 text-2xl font-bold">Quick Links</h2>

                    <div className="flex flex-col gap-3">
                        <NavLink to="/" className={footerLinkStyle}>
                            Home
                        </NavLink>

                        <NavLink to="/about" className={footerLinkStyle}>
                            About
                        </NavLink>

                        <NavLink to="/contact" className={footerLinkStyle}>
                            Contact
                        </NavLink>
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-2xl font-bold">Our Services</h2>

                    <div className="flex flex-col gap-3 text-[var(--color-footer-muted)]">
                        <p>Emergency Care</p>
                        <p>ICU Services</p>
                        <p>Laboratory</p>
                        <p>Qualified Doctors</p>
                        <p>24/7 Ambulance</p>
                    </div>
                </div>

                <div>
                    <h2 className="mb-5 text-2xl font-bold">Contact Us</h2>

                    <div className="flex flex-col gap-4 text-[var(--color-footer-muted)]">
                        <p className="flex items-center gap-3">
                            <FaPhoneAlt />
                            +91 9876543210
                        </p>

                        <p className="flex items-center gap-3">
                            <FaEnvelope />
                            hospital@gmail.com
                        </p>

                        <p className="flex items-center gap-3">
                            <FaMapMarkerAlt />
                            Delhi, India
                        </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <a
                            href="#"
                            className="rounded-full bg-[rgba(255,255,255,0.95)] p-3 text-blue-900 transition hover:scale-110"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="#"
                            className="rounded-full bg-[rgba(255,255,255,0.95)] p-3 text-pink-600 transition hover:scale-110"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="#"
                            className="rounded-full bg-[rgba(255,255,255,0.95)] p-3 text-blue-400 transition hover:scale-110"
                        >
                            <FaTwitter />
                        </a>

                        <a
                            href="#"
                            className="rounded-full bg-[rgba(255,255,255,0.95)] p-3 text-red-600 transition hover:scale-110"
                        >
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6 text-center text-[var(--color-footer-muted)]">
                <p>Copyright 2026 MyWebsite. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
