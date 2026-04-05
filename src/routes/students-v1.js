const express = require('express');
const router = express.Router();
const { createStudentNamespace } = require('../services/k8s-service');
const studentController = require('../controllers/student-controller');

// POST /api/students/register
router.post('/register', studentController.registerStudent);

module.exports = router;