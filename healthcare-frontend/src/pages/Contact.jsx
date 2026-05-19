import React, { useState } from "react";
import axios from "axios";

const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            // BACKEND API
            const res = await axios.post(
                "http://localhost:5000/api/contact",
                formData
            );

            alert(res.data.message);

            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

        } catch (error) {
            console.log(error);

            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* HERO SECTION */}
            <div className="bg-blue-700 text-white py-20 px-6 text-center">

                <h1 className="text-5xl font-bold mb-4">
                    Contact Our Hospital
                </h1>

                <p className="max-w-3xl mx-auto text-lg text-gray-200">
                    Have questions, need emergency assistance, or want to book
                    an appointment? Our healthcare team is available 24/7.
                </p>

            </div>


            {/* MAIN SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-10">

                {/* LEFT SIDE */}
                <div className="lg:col-span-1 space-y-6">

                    {/* CARD */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">

                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Hospital Information
                        </h2>

                        <div className="space-y-5 text-gray-600">

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Address
                                </h3>

                                <p>
                                    Sector 62, Noida, Uttar Pradesh, India
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Emergency Number
                                </h3>

                                <p>+91 9876543210</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Email Support
                                </h3>

                                <p>support@hospital.com</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Working Hours
                                </h3>

                                <p>Monday - Sunday (24/7 Available)</p>
                            </div>

                        </div>
                    </div>


                    {/* MAP */}
                    <div className="bg-white p-4 rounded-2xl shadow-md">

<iframe
    title="hospital-map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3799030650252!2d77.3703518745723!3d28.618373984725103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef719cf3f0b3%3A0xc24d4fda4fdca748!2sFortis%20Hospital%20Noida%20-%20Best%20Hospital%20in%20Noida!5e0!3m2!1sen!2sin!4v1778570184369!5m2!1sen!2sin"
    width="100%"
    height="350"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-2xl border-0 shadow-md"
></iframe>

                    </div>

                </div>


                {/* RIGHT SIDE FORM */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">

                    <h2 className="text-3xl font-bold mb-2 text-gray-800">
                        Send Us a Message
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Fill out the form below and our team will contact you shortly.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-2 gap-6"
                    >

                        {/* NAME */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </div>


                        {/* EMAIL */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </div>


                        {/* PHONE */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your number"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </div>


                        {/* SUBJECT */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Subject
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </div>


                        {/* MESSAGE */}
                        <div className="md:col-span-2">

                            <label className="block mb-2 font-medium">
                                Message
                            </label>

                            <textarea
                                rows="6"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message..."
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
                            ></textarea>

                        </div>


                        {/* BUTTON */}
                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl transition duration-300"
                            >
                                {
                                    loading
                                        ? "Sending..."
                                        : "Send Message"
                                }
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
};

export default Contact;
