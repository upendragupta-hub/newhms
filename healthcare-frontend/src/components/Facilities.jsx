import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        API.get("/facilities").then((res) => setFacilities(res.data));
    }, []);

    return (
        <section className="bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 sm:text-5xl">
                        Our Facilities
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
                        Explore our hospital facilities with modern care, dedicated staff, and 24/7 support.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {facilities.map((item) => (
                        <Link
                            key={item._id}
                            to={`/facility/${item._id}`}
                            className="group block bg-white w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full">
                                    Facility
                                </span>
                            </div>

                            <div className="p-5">
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {item.title}
                                </h2>
                                <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                                    {item.description}
                                </p>
                                <div className="mt-5 flex items-center justify-between text-sm text-blue-600">
                                    <span className="font-medium transition group-hover:text-blue-800">
                                        View Details →
                                    </span>
                                    <span className="text-[11px] text-slate-400">24/7</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Facilities;
