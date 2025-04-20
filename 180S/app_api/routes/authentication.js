const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authentication');

// Register route
router.post('/register', authCtrl.register);

// Login route
router.post('/login', authCtrl.login);

// Status route
router.get('/status', authCtrl.status);

module.exports = router; 