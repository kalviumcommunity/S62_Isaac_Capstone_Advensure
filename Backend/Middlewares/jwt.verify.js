const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    // console.log("Received Token:", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, please login", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token please login again", success: false });
    }
};

module.exports = verifyUser;
