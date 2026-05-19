// import React from 'react'

// const PatientsManagement = () => {
//   return (
//     <div>PatientsManagement</div>
//   )
// }

// export default PatientsManagement






import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Patients fetch karne ka function
    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://newhms.onrender.com/api/patients/all", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setPatients(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching patients:", error);
            setLoading(false);
        }
    };

    // Patient delete karne ka function
    const deletePatient = async (id) => {
        if (window.confirm("Kya aap sach mein is patient ka record delete karna chahte hain?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`https://newhms.onrender.com/api/patients/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                fetchPatients(); // List refresh karein
            } catch (error) {
                alert("Delete fail ho gaya.");
            }
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Search logic: Name ya Phone se filter
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.phone.includes(searchTerm)
    );

    if (loading) return <div className="p-5 text-center text-xl font-bold text-blue-600">Loading Patients Database...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">Patient Database</h2>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-1/3">
                    <input 
                        type="text" 
                        placeholder="Search by Name or Phone..." 
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-600 text-white text-sm uppercase">
                        <tr>
                            <th className="p-4">Patient Details</th>
                            <th className="p-4 text-center">Visit Count</th>
                            <th className="p-4">Registered On</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map(p => (
                                <tr key={p._id} className="border-b hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800 text-lg">{p.name}</div>
                                        <div className="text-sm text-gray-500 font-medium">{p.phone} | {p.email}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-bold">
                                            {p.visitCount} Visits
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(p.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => deletePatient(p._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                                            title="Delete Record"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-500 italic">
                                    No patients found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPatientManagement;