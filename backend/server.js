// backend/server.js

import express from 'express';

import mongoose from 'mongoose';

import cors from 'cors';

import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

dotenv.config();


// Routes
import facilityRoutes from './routes/facilityRoutes.js';

import adminRoutes from "./routes/adminRoutes.js";

import doctorRoutes from "./routes/doctorRoutes.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";

import patientRoutes from "./routes/patientRoutes.js";

import userRouter from './routes/userRoute.js';

import contactRoutes from "./routes/contactRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import demoRoutes from './routes/demoRoutes.js';





const app = express();


// CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "token"
    ]
}));


// Middleware
app.use(express.json());

app.use(cookieParser());


// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)

    .then(() =>
        console.log('✅ MongoDB Connected')
    )

    .catch((err) =>
        console.log('❌ Error:', err)
    );


// Routes
app.use(
    "/api/facilities",
    facilityRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/doctors",
    doctorRoutes
);



app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.use(
    "/api/user",
    userRouter
);

app.use(
    "/api/contact",
    contactRoutes
);

app.use(
    "/api/products",
    productRoutes
);





app.use('/api/demo', demoRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>

    console.log(
        `🚀 Server running on port ${PORT}`
    )

);
