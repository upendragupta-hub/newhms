import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const AdminLogin = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

            const res = await axios.post(

                "https://newhms.onrender.com/api/admin/login",

                formData

            );


            Cookies.set("token", res.data.token, {
                expires: 30,
            });

            // Token ko localStorage mein save karein taaki Admin pages access kar sakein
            localStorage.setItem("token", res.data.token);


            alert("Login Successful");

            navigate("/admin-dashboard");

        } catch (error) {

            console.log(error);

            alert("Invalid Credentials");

        }

    };



    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >

                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Admin Login
                </h1>



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
                    Login
                </button>



                <p className="text-center mt-5">

                    Don't have an account?

                    <Link
                        to="/admin-signup"
                        className="text-blue-600 font-bold ml-2"
                    >
                        Signup
                    </Link>

                </p>

            </form>

        </div>

    );

};

export default AdminLogin;