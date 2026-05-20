import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import {
    getPatientAuthHeaders,
    getPatientToken,
    getStoredPatient,
    setPatientSession,
} from "../utils/patientSession";

const MyAccount = () => {
    const token = getPatientToken();
    const [appointments, setAppointments] = useState([]);
    const [patient, setPatient] = useState(getStoredPatient());
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadPatientProfile = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await API.get('/patients/me', {
                headers: getPatientAuthHeaders(),
            });

            if (data.success) {
                setPatient(data.patient);
                setProfileData({
                    name: data.patient.name || "",
                    email: data.patient.email || "",
                    phone: data.patient.phone || "",
                    gender: data.patient.gender || "",
                    age: data.patient.age || "",
                    address: data.patient.address || "",
                });
                setPatientSession({ token, patient: data.patient });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile load nahi ho pa raha.");
        }
    };

    const getUserAppointments = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await API.get('/appointments/my-appointments', {
                headers: getPatientAuthHeaders(),
            });
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
                `/appointments/${appointmentId}/cancel`,
                {},
                { headers: getPatientAuthHeaders() }
            );
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...profileData,
                age: profileData.age ? Number(profileData.age) : undefined,
            };

            const { data } = await API.put('/patients/me', payload, {
                headers: getPatientAuthHeaders(),
            });

            if (data.success) {
                setPatient(data.patient);
                setProfileData({
                    name: data.patient.name || "",
                    email: data.patient.email || "",
                    phone: data.patient.phone || "",
                    gender: data.patient.gender || "",
                    age: data.patient.age || "",
                    address: data.patient.address || "",
                });
                setPatientSession({ token, patient: data.patient });
                toast.success(data.message || "Profile updated successfully.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        loadPatientProfile();
        getUserAppointments();
    }, [token]);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    if (!token) {
        return (
            <div className="p-5 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Please login to view your account</h2>
                <p className="text-gray-600">Apna profile update karne ke liye pehle login karein.</p>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-5xl mx-auto space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">My Profile</h2>
                        <p className="text-sm text-slate-500">Apni personal details yahan update karein.</p>
                    </div>
                    <span className="text-sm text-slate-600">
                        Last saved: {patient?.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : "--"}
                    </span>
                </div>

                <form onSubmit={handleProfileUpdate} className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                        Name
                        <input
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                        Email
                        <input
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                        Phone
                        <input
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                        Gender
                        <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        >
                            <option value="">Choose gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                        Age
                        <input
                            name="age"
                            type="number"
                            min="0"
                            value={profileData.age}
                            onChange={handleProfileChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                        Address
                        <textarea
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            rows="3"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                        />
                    </label>
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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