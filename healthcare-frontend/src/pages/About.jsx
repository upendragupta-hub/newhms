import React from "react";

const About = () => {
    return (
        <div className="w-full">

            {/* HERO SECTION */}
            <div className="bg-blue-600 text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    About Our Hospital
                </h1>

                <p className="max-w-3xl mx-auto text-lg">
                    We provide the best healthcare services with experienced
                    doctors and modern medical facilities for all patients.
                </p>
            </div>


            {/* ABOUT CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

                {/* IMAGE */}
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
                        alt="hospital"
                        className="rounded-2xl shadow-lg w-full"
                    />
                </div>


                {/* TEXT */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        Who We Are
                    </h2>

                    <p className="text-gray-600 mb-4 leading-7">
                        Our hospital is dedicated to providing high-quality
                        healthcare services with compassion and care.
                        We have a team of highly qualified doctors,
                        nurses, and medical staff.
                    </p>

                    <p className="text-gray-600 mb-4 leading-7">
                        We use advanced medical technology and modern
                        treatment methods to ensure the best patient care.
                    </p>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mt-4">
                        Learn More
                    </button>
                </div>
            </div>


            {/* FEATURES */}
            <div className="bg-gray-100 py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why Choose Us
                </h2>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Expert Doctors
                        </h3>

                        <p className="text-gray-600">
                            Highly experienced doctors available for all departments.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Emergency Care
                        </h3>

                        <p className="text-gray-600">
                            24/7 emergency healthcare support for patients.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Modern Equipment
                        </h3>

                        <p className="text-gray-600">
                            Advanced medical tools and latest treatment facilities.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default About;