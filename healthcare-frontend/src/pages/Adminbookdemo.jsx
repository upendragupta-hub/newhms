import axios from "axios";
import { useEffect, useState } from "react";

const Adminbookdemo = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/demo/all"
                );

                setData(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                        Admin Demo Requests
                    </p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-900">
                        Demo Requests
                    </h1>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {data.map((item) => (
                        <article
                            key={item._id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md"
                        >
                            <h2 className="mb-4 text-2xl font-semibold text-blue-600">
                                {item.fullName}
                            </h2>

                            <div className="space-y-2 text-sm text-slate-600">
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Email:
                                    </span>{" "}
                                    {item.email}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Phone:
                                    </span>{" "}
                                    {item.phone}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Hospital:
                                    </span>{" "}
                                    {item.hospitalName}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Date:
                                    </span>{" "}
                                    {item.preferredDate}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Notes:
                                    </span>{" "}
                                    {item.notes}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                View Details
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Adminbookdemo;
