import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AdminSignup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",

    });




    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };





    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(

                "http://localhost:5000/api/admin/signup",

                formData

            );


            alert("Signup Successful");

            navigate("/admin");

        } catch (error) {

            console.log(error);

        }

    };



    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >

                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Admin Signup
                </h1>



                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg mb-4"
                    required
                />



                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg mb-4"
                    required
                />



                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg mb-4"
                    required
                />



                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                    Signup
                </button>



                <p className="text-center mt-5">

                    Already have an account?

                    <Link
                        to="/admin"
                        className="text-blue-600 font-bold ml-2"
                    >
                        Login
                    </Link>

                </p>

            </form>

        </div>

    );

};

export default AdminSignup;