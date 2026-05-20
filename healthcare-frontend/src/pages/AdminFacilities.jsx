import { useEffect, useState } from "react";
import axios from "axios";

const AdminFacilities = () => {

    const [facilities, setFacilities] = useState([]);

    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
    });

    // GET
    const fetchFacilities = async () => {
        try {
            const res = await axios.get("https://newhms.onrender.com/api/facilities");
            setFacilities(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    // INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ADD + UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editId) {

                await axios.put(
                    `https://newhms.onrender.com/api/facilities/${editId}`,
                    formData
                );

                alert("Updated Successfully");

            } else {

                await axios.post(
                    "https://newhms.onrender.com/api/facilities",
                    formData
                );

                alert("Added Successfully");
            }

            setFormData({
                title: "",
                description: "",
                image: "",
            });

            setEditId(null);

            fetchFacilities();

        } catch (err) {
            console.log(err);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://newhms.onrender.com/api/facilities/${id}`);
            fetchFacilities();
        } catch (err) {
            console.log(err);
        }
    };

    // EDIT
    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            image: item.image,
        });

        setEditId(item._id);
    };

    return (
        <div className="p-5">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

            <h2 className="text-2xl font-bold mb-4">Facilities Admin</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-4 shadow mb-6">

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border p-2 w-full mb-2"
                />

                <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border p-2 w-full mb-2"
                />

                <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                    className="border p-2 w-full mb-2"
                />

                <button className="bg-blue-600 text-white px-4 py-2">
                    {editId ? "Update" : "Add"}
                </button>

            </form>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {facilities.map((item) => (
                    <div key={item._id} className="bg-white p-3 shadow">

                        <img src={item.image} className="h-40 w-full object-cover" />

                        <h3 className="font-bold">{item.title}</h3>
                        <p>{item.description}</p>

                        <div className="flex gap-2 mt-2">

                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-yellow-500 px-2 text-white"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-600 px-2 text-white"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                ))}

            </div>
            </div>

        </div>
    );
};

export default AdminFacilities;