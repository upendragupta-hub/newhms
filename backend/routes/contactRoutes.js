import express from "express";

import {
    createContact,
    getAllContacts
} from "../controllers/contactController.js";

const router = express.Router();


// CREATE CONTACT
router.post("/", createContact);


// GET ALL CONTACTS
router.get("/", getAllContacts);

export default router;