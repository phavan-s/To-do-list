const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }   
    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;