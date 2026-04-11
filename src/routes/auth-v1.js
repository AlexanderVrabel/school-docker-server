const express = require('express');
const router = express.Router();
const auth = require("../middleware/google-auth");

router.post('/login',auth.verifyUser);
router.post('/logout',auth.logoutUser);

module.exports = router;