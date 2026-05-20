import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Doctors() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        axios
            .get("https://newhms.onrender.com/api/doctors/get")
            .then((res) => {
                setDoctors(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                    Doctors
                </p>
                <h1 className="mt-3 text-4xl font-bold text-(--color-text)">
                    Meet Our Doctors
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-(--color-muted)">
                    Experienced specialists ready to help with consultations,
                    treatment planning, and follow-up care.
                </p>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {doctors.map((doc) => (
                    <article
                        key={doc._id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <img
                            src={doc.image}
                            alt={doc.name}
                            className="h-52 w-full object-cover"
                        />

                        <div className="space-y-3 p-5">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    Dr. {doc.name}
                                </h2>
                                <p className="text-sm text-slate-600">
                                    {doc.specialization}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600">
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Experience:
                                    </span>{" "}
                                    {doc.experience} years
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Fee:
                                    </span>{" "}
                                    Rs. {doc.fee}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Email:
                                    </span>{" "}
                                    {doc.email}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Phone:
                                    </span>{" "}
                                    {doc.phone}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Status:
                                    </span>{" "}
                                    <span
                                        className={
                                            doc.available
                                                ? "font-semibold text-emerald-600"
                                                : "font-semibold text-rose-600"
                                        }
                                    >
                                        {doc.available ? "Available" : "Not Available"}
                                    </span>
                                </p>
                            </div>

                            <Link
                                to="/book-appointment"
                                state={{ doctorId: doc._id }}
                                className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                                    doc.available
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "cursor-not-allowed bg-slate-300 pointer-events-none"
                                }`}
                            >
                                {doc.available ? "Book Appointment" : "Unavailable"}
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Doctors;
