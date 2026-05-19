import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// ================= SIGNUP =================

// export const signupAdmin = async (req, res) => {

//     try {

//         const { name, email, password } = req.body;

//         // CHECK ADMIN EXISTS

//         const existingAdmin = await Admin.findOne({ email });

//         if (existingAdmin) {

//             return res.status(400).json({
//                 message: "Admin already exists",
//             });

//         }


//         // HASH PASSWORD

//         const hashedPassword = await bcrypt.hash(password, 10);


//         // CREATE ADMIN

//         const admin = await Admin.create({
//             name,
//             email,
//             password: hashedPassword,
//         });


//         res.status(201).json({
//             message: "Signup Successful",
//             admin,
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message,
//         });

//     }

// };



// ================= SIGNUP =================

export const signupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. SABSE PEHLE CHECK KAREIN KI KYA KOI BHI ADMIN EXIST KARTA HAI
        const adminCount = await Admin.countDocuments();
        if (adminCount >= 1) {
            return res.status(403).json({ 
                message: "Registration Closed: An admin already exists. Contact Super Admin." 
            });
        }

        // 2. AGAR ADMIN NAHI HAI, TOH EMAIL CHECK KAREIN (Duplication se bachne ke liye)
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists",
            });
        }

        // 3. HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. CREATE ADMIN
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "Signup Successful",
            admin,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};





export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // CHECK ADMIN
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password",
            });
        }

        // TOKEN GENERATE
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || "apni_secret_key",
            { expiresIn: "7d" }
        );

        // --- COOKIE ADDED HERE ---
        res.status(200).cookie("token", token, {
            httpOnly: true,      // Frontend JS isse read nahi kar payegi (Security)
            secure: false,       // Localhost par false hi rakhein (HTTPS ke liye true hota hai)
            sameSite: "lax",     // CSRF protection ke liye
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Din tak valid rahega
        }).json({
            message: "Login Successful",
            token,               // JSON mein bhi bhej rahe hain taaki frontend localStorage mein save kar sake
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};