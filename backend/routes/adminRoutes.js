import express from "express";

import {
    signupAdmin,
    loginAdmin,
} from "../controllers/adminController.js";

const router = express.Router();


// SIGNUP

router.post("/signup",  signupAdmin);


// LOGIN

router.post("/login",  loginAdmin);

export default router;