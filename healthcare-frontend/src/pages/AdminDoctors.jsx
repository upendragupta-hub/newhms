
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDoctors = () => {

    const [doctors, setDoctors] = useState([]);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        experience: "",
        fee: "",
        email: "",
        phone: "",
        available: true,
        image: ""
    });

    // GET DOCTORS
    const fetchDoctors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/doctors/get");
            setDoctors(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // INPUT CHANGE
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ADD + UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editId) {

                await axios.put(
                    `http://localhost:5000/api/doctors/${editId}`,
                    formData
                );

                alert("Doctor Updated Successfully");

            } else {

                await axios.post(
                    "http://localhost:5000/api/doctors/add",
                    formData
                );

                alert("Doctor Added Successfully");
            }

            setFormData({
                name: "",
                specialization: "",
                experience: "",
                fee: "",
                email: "",
                phone: "",
                available: true,
                image: ""
            });

            setEditId(null);

            fetchDoctors();

        } catch (err) {
            console.log(err);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/doctors/${id}`);
            alert("Doctor Deleted");
            fetchDoctors();
        } catch (err) {
            console.log(err);
        }
    };

    // EDIT
    const handleEdit = (doctor) => {
        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            experience: doctor.experience,
            fee: doctor.fee,
            email: doctor.email,
            phone: doctor.phone,
            available: doctor.available,
            image: doctor.image
        });

        setEditId(doctor._id);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">

            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">

                <h1 className="text-2xl font-bold mb-4 text-center">
                    {editId ? "Edit Doctor" : "Add Doctor"}
                </h1>

                <div className="grid md:grid-cols-2 gap-3">

                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2" />

                    <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="border p-2" />

                    <input type="number" min="0" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" className="border p-2" required />

                    <input type="number" min="0" name="fee" value={formData.fee} onChange={handleChange} placeholder="Fee" className="border p-2" required />

                    <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2" />

                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2" />

                    <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="border p-2" />

                </div>

                {/* AVAILABLE */}
                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                    />
                    <label>Available</label>
                </div>

                <button className="bg-blue-600 text-white w-full py-2 mt-4">
                    {editId ? "Update Doctor" : "Add Doctor"}
                </button>

            </form>

            {/* LIST */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 mt-8">

                {doctors.map((doc) => (
                    <div key={doc._id} className="bg-white p-4 rounded shadow">

                        <img src={doc.image} className="h-40 w-full object-cover" />

                        <h2 className="text-xl font-bold">{doc.name}</h2>
                        <p>{doc.specialization}</p>
                        <p>{doc.experience} years</p>
                        <p>₹{doc.fee}</p>
                        <p>{doc.email}</p>
                        <p>{doc.phone}</p>

                        <p className={doc.available ? "text-green-600" : "text-red-600"}>
                            {doc.available ? "Available" : "Not Available"}
                        </p>

                        <div className="flex gap-2 mt-3">

                            <button
                                onClick={() => handleEdit(doc)}
                                className="bg-yellow-500 px-3 py-1 text-white"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(doc._id)}
                                className="bg-red-600 px-3 py-1 text-white"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default AdminDoctors;
