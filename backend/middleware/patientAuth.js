import jwt from "jsonwebtoken";

const authPatient = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization ||
            req.headers.token ||
            // patientToken cookie (if set)
            req.cookies?.patientToken ||
            // fallback: admin middleware uses cookies.token
            req.cookies?.token;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Login required! Token nahi mila.",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "apni_secret_key"
        );

        req.patientId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Invalid token, dubara login karein.",
        });
    }
};

export default authPatient;
