import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
    try {

        // token header ya cookie se lo
        const token = 
            req.headers.authorization || 
            req.headers.token || 
            req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token found"
            });
        }

        // agar Bearer token hai
        const actualToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || "apni_secret_key");

        req.admin = decoded; // admin data attach

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
    }
};

export default verifyAdmin;