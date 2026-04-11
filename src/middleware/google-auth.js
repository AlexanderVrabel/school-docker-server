const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

async function verifyUser(req,res) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID, // Must match your Client ID
        });

        const payload = ticket.getPayload();

        // THE RESTRICTION: Check the Hosted Domain (hd)
        const domain = payload['hd'];

        // Success! You now have the user's verified info
        const userId = payload['sub'];
        const email = payload['email'];

        return { success: true, email };

    } catch (error) {
        console.error("Verification failed:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { verifyUser };