import { useState } from "react";
import AdminFacilities from "./AdminFacilities";
import AdminDoctors from "./AdminDoctors";
import Adminappointmentslist from "./Adminappointmentslist";
import PatientsManagement from "./PatientsManagement";
import AdminContacts from "./AdminContacts";
import Adminbookdemo from "./Adminbookdemo";
import BedManagement from "./BedManagement";


const Admin = () => {

    const [tab, setTab] = useState("facilities");

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* LEFT SIDEBAR */}
            <div className="md:w-64 w-full bg-gray-900 text-white p-5">

                <h2 className="text-xl font-bold mb-6">
                    Admin Panel
                </h2>

                <button
                    onClick={() => setTab("facilities")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                    Facilities
                </button>

                <button
                    onClick={() => setTab("doctors")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                    Doctors
                </button>


                  <button
                    onClick={() => setTab("Appointment")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                    appointment
                </button>



                    <button
                    onClick={() => setTab("Patients Management")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                    Patient Management
                </button>

                  <button
                    onClick={() => setTab("Contact Messages")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                  Contact Messages
                </button>

                 <button

                  onClick={() => setTab("adminbookdemo")}
                   
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                 adminbookdemo
                </button>

                <button
                    onClick={() => setTab("beds")}
                    className="block w-full text-left p-2 hover:bg-gray-700"
                >
                    Bed Management
                </button>

            </div>


            {/* RIGHT CONTENT */}
            <div className="flex-1 p-6 bg-gray-100">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {tab === "facilities" && <AdminFacilities />}

                {tab === "doctors" && <AdminDoctors />}
                {tab === "Appointment" && <Adminappointmentslist />}

                 {tab === "Patients Management" && <PatientsManagement />}

                 {tab === "Contact Messages" && <AdminContacts />}

                  {tab === "adminbookdemo" && <Adminbookdemo />}

                  {tab === "beds" && <BedManagement />}

                </div>
            </div>

        </div>
    );
};

export default Admin;