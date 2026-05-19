import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContacts = () => {

    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {

        try {

            const res = await axios.get(
                "https://newhms.onrender.com/api/contact"
            );

            setContacts(res.data.contacts);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Contact Messages
            </h1>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-blue-600 text-white">

                        <tr>

                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Phone
                            </th>

                            <th className="p-4 text-left">
                                Subject
                            </th>

                            <th className="p-4 text-left">
                                Message
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            contacts.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b"
                                >

                                    <td className="p-4">
                                        {item.name}
                                    </td>

                                    <td className="p-4">
                                        {item.email}
                                    </td>

                                    <td className="p-4">
                                        {item.phone}
                                    </td>

                                    <td className="p-4">
                                        {item.subject}
                                    </td>

                                    <td className="p-4">
                                        {item.message}
                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AdminContacts;