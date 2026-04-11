const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
const database = require("../services/prisma-service.js")
const JWT_SECRET = process.env.JWT_SECRET || "fallback_default_secret_please_change_me_in_env";

async function verifyUser(req, res, next) {
    try {
        if (!req.body.token) {
            return res.status(400).json({ success: false, error: "No token provided" });
        }

        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload['email'];

        // Generate our own Backend JWT tokena
        const authToken = jwt.sign(
            { 
               userId: payload['sub'], 
               email: payload['email'], 
               name: payload['name'],
               picture: payload['picture'] 
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Secure session for 7 days
        );

        // Set the httpOnly cookie so the browser securely holds it
        res.cookie('auth_token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies strictly over HTTPS in prod
            sameSite: 'lax', // Protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        await database.createUser(email);

        return res.status(200).json({ success: true, email, message: "Logged in and session established." });

    } catch (error) {
        console.error("Verification failed:", error.message);
        return res.status(401).json({ success: false, error: error.message });
    }
}

// requireAuth middleware now checks the cookie!
function requireAuth(req, res, next) {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ success: false, error: "Unauthorized: No session cookie found" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // The decoded user object from our JWT
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid or expired session" });
    }
}

// Optionally, a logout route handler
function logoutUser(req, res) {
    res.clearCookie('auth_token');
    return res.status(200).json({ success: true, message: "Successfully logged out" });
}

module.exports = { verifyUser, requireAuth, logoutUser };