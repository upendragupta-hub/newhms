// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AdminAppointments = () => {
//     const [appointments, setAppointments] = useState([]);

//     const fetchAll = async () => {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/appointments/", {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         setAppointments(res.data);
//     };

//     const updateStatus = async (id, status) => {
//         const token = localStorage.getItem("token");
//         await axios.put(`http://localhost:5000/api/appointments/status/${id}`, { status }, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         fetchAll(); // List refresh karein
//     };

//     useEffect(() => { fetchAll(); }, []);

//     return (
//         <div className="p-5">
//             <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
//             <table className="w-full bg-white shadow rounded overflow-hidden">
//                 <thead className="bg-gray-200">
//                     <tr>
//                         <th className="p-3">Patient</th>
//                         <th className="p-3">Doctor</th>
//                         <th className="p-3">Status</th>
//                         <th className="p-3">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {appointments.map(app => (
//                         <tr key={app._id} className="border-b text-center">
//                             <td className="p-3">{app.patientName}</td>
//                             <td className="p-3">{app.doctor?.name}</td>
//                             <td className="p-3">
//                                 <span className={app.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}>
//                                     {app.status}
//                                 </span>
//                             </td>
//                             <td className="p-3 space-x-2">
//                                 <button onClick={() => updateStatus(app._id, 'Confirmed')} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Approve</button>
//                                 <button onClick={() => updateStatus(app._id, 'Cancelled')} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Reject</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };



// export default AdminAppointments;




import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        try {
            // Localstorage se token nikalein (back-up ke liye)
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/api/appointments/", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
                // ZAROORI: Cookies bhejane ke liye
                withCredentials: true 
            });
            
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
            setLoading(false);
            if (error.response?.status === 401) {
                alert("Session Expired ya Unauthorized! Phir se login karein.");
            }
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/appointments/status/${id}`, 
                { status }, 
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true 
                }
            );
            alert(`Appointment ${status} successfully!`);
            fetchAll(); // List refresh karein
        } catch (error) {
            alert("Status update fail ho gaya.");
        }
    };

    const deleteAppointment = async (id) => {
        if (!window.confirm("Kya aap sach mein is appointment ko delete karna chahte hain?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`http://localhost:5000/api/appointments/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
            alert(res.data.message || "Appointment deleted successfully!");
            fetchAll(); // List refresh karein
        } catch (error) {
            console.error("Delete Error:", error.response?.data || error.message);
            alert("Delete fail ho gaya.");
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    if (loading) return <div className="p-5 text-center font-bold">Loading Appointments...</div>;

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Bookings</h2>
                <button onClick={fetchAll} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Refresh</button>
            </div>

            <div className="overflow-x-auto shadow rounded-lg">
                <table className="w-full bg-white">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th className="p-3 text-left">Patient</th>
                            <th className="p-3 text-left">Doctor</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map(app => (
                                <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">
                                        <div className="font-semibold">{app.patientName}</div>
                                        <div className="text-xs text-gray-500">{app.patientPhone}</div>
                                    </td>
                                    <td className="p-3 text-gray-700">{app.doctor?.name || "N/A"}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                            app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        {app.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(app._id, 'Confirmed')} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Approve</button>
                                                <button onClick={() => updateStatus(app._id, 'Cancelled')} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Reject</button>
                                            </>
                                        )}
                                        <button onClick={() => deleteAppointment(app._id)} className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-5 text-center text-gray-500">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAppointments;