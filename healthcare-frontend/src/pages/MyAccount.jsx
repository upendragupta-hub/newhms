import React, { useEffect, useState } from 'react';
import API from '../utils/api'; // Upar wala axios instance
import { toast } from 'react-toastify';
import {
    getPatientAuthHeaders,
} from "../utils/patientSession";

const  MyAccount = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserAppointments = async () => {
        try {
            const { data } = await API.get('/my-appointments');
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching appointments");
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await API.patch(
                `/${appointmentId}/cancel`,
                {},
                { headers: getPatientAuthHeaders() }
            );
            if (data.success) {
                toast.success(data.message);
                getUserAppointments(); // List ko refresh karein
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

    useEffect(() => {
        getUserAppointments();
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">My Appointments</h2>
            
            {appointments.length === 0 ? (
                <p className="text-gray-500">Aapne abhi tak koi appointment book nahi kiya hai.</p>
            ) : (
                <div className="space-y-4">
                    {appointments.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            {/* Doctor Image (Placeholder) */}
                            <div className="w-32 h-32 bg-indigo-50 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                    src={item.doctor.image || "https://via.placeholder.com/150"} 
                                    alt="doctor" 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <p className="text-lg font-medium text-gray-800">{item.doctor.name}</p>
                                <p className="text-sm text-gray-600">{item.doctor.specialization}</p>
                                <div className="mt-2 text-sm text-gray-700">
                                    <p><span className="font-semibold">Date:</span> {new Date(item.appointmentDate).toLocaleDateString()}</p>
                                    <p><span className="font-semibold">Time:</span> {item.slotTime}</p>
                                </div>
                            </div>

                            {/* Status and Actions */}
                            <div className="flex flex-col justify-end gap-2">
                                <button className={`px-4 py-1.5 rounded text-sm font-medium border ${
                                    item.status === 'Pending' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 
                                    item.status === 'Confirmed' ? 'text-green-600 border-green-200 bg-green-50' : 
                                    'text-red-600 border-red-200 bg-red-50'
                                }`}>
                                    {item.status}
                                </button>
                                <button 
                                    onClick={() => cancelAppointment(item._id)}
                                    disabled={item.status === 'Cancelled' || item.status === 'Completed'}
                                    className="text-sm px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAccount;