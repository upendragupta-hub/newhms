import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.json({ success: false, message: "Details missing" });

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: false, // Localhost pe false hi rahega
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ success: true, message: "User Registered Successfully", user: { name: user.name } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) return res.json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            
            res.cookie("token", token, { 
                httpOnly: true, 
                secure: false, 
                sameSite: 'Lax',
                maxAge: 24 * 60 * 60 * 1000 
            });

            res.json({ success: true, message: "Logged In", user: { name: user.name, email: user.email } });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};