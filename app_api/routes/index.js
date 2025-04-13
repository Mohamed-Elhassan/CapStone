const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Import authentication middleware

// Import controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const workoutController = require('../controllers/workouts');

console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);

// Define routes
router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(verifyToken, tripsController.tripsAddTrip);  // Uses `verifyToken`

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(verifyToken, tripsController.tripsUpdateTrip);  // Uses `verifyToken`

router.get('/workout/today', workoutController.getTodaysWorkout);

module.exports = router;
