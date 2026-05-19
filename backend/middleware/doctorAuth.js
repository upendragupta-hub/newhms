import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization ||
            req.headers.token ||
            req.cookies?.doctorToken ||
            req.cookies?.token;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Doctor login required.",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "apni_secret_key"
        );

        if (decoded.role !== "doctor" || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid doctor token.",
            });
        }

        req.doctorId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token, dubara login karein.",
        });
    }
};

export default authDoctor;
