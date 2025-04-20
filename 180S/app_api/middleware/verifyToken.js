const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    console.log("🔍 Middleware: Checking token...");

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("No Authorization header received");
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
    console.log("✅ Received Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        console.log("✅ Token Verified: ", decoded);
        req.user = decoded;  // Attach user to request
        next();  // Pass to next middleware
    });
}

module.exports = verifyToken;
