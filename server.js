const express = require('express');
const studentRoutes = require('./src/routes/students-v1.js');
const authRoutes = require('./src/routes/auth-v1.js');
const {auth} = require("google-auth-library");
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());

// Link the routes
// This means all routes in student-routes.js start with /api/students
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server spinning on http://localhost:${PORT}`);
    console.log(`📡 Ready to deploy to Home Lab at server.vrabel.me`);
});