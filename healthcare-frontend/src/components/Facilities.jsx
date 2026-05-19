import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Facilities = () => {

    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        API.get("/facilities").then((res) => setFacilities(res.data));
    }, []);

    return (
<>
<h1  className="text-5xl font-bold text-center text-blue-600 ">Our Facilities</h1>
        {/* <div className="grid md:grid-cols-3 gap-5 p-10">

            {facilities.map((item) => (

                <div
                    key={item._id}
                    className="shadow-lg rounded-xl overflow-hidden"
                >

                    <img
                        src={item.image}
                        className="h-52 w-full object-cover"
                        alt=""
                    />

                    <div className="p-5">

                        <h1 className="text-2xl font-bold">
                            {item.title}
                        </h1>

                        <p className="text-gray-600 mt-2">
                            {item.description}
                        </p>

                    </div>

                </div>

            ))}

        </div> */}


<div className="grid gap-5 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">

    {facilities.map((item) => (

        <Link
            key={item._id}
            to={`/facility/${item._id}`}
            className="group block bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >

            {/* Image */}
            <div className="relative overflow-hidden">

                <img
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full">
                    Facility
                </span>

            </div>

            {/* Content */}
            <div className="p-4">

                <h1 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    {item.title}
                </h1>

                <p className="text-gray-500 mt-2 text-sm line-clamp-2">
                    {item.description}
                </p>

                <div className="mt-4 flex justify-between items-center">

                    <span className="text-sm font-medium text-blue-600 transition group-hover:text-blue-800">
                        View Details →
                    </span>

                    <span className="text-[11px] text-gray-400">
                        24/7
                    </span>

                </div>

            </div>

        </Link>

    ))}

</div>
</>

    );
};

export default Facilities;
