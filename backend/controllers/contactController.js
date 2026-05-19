import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {

    try {

        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contact,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};




export const getAllContacts = async (req, res) => {

    try {

        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            contacts,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};