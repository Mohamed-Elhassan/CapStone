const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/authentication');
const ctrlUsers = require('../controllers/users');
const ctrlMealPlans = require('../controllers/mealPlans');
const jwtAuth = require('../middleware/auth');
const ctrlWorkouts = require('../controllers/workouts');

// Authentication routes
router
    .route('/login')
    .post(ctrlAuth.login);

router
    .route('/register')
    .post(ctrlAuth.register);

// Workout routes
router.get('/workout/today', ctrlWorkouts.getTodaysWorkout);

// Meal plan routes
router.get('/mealPlans', ctrlMealPlans.getMealPlans);
router.delete('/mealPlans/:id', jwtAuth, ctrlMealPlans.deleteMealPlan);
router.post('/mealPlans/:mealPlanId/save', jwtAuth, ctrlMealPlans.saveMealPlan);
router.post('/mealPlans/:mealPlanId/unsave', jwtAuth, ctrlMealPlans.unsaveMealPlan);
router.get('/mealPlans/saved', jwtAuth, ctrlMealPlans.getSavedMealPlans);

// User management routes
router.get('/users', jwtAuth, ctrlUsers.getUsers);
router.put('/users/:userId/admin', jwtAuth, ctrlUsers.toggleAdminStatus);

// Workout operations routes
router.post('/workouts/save', jwtAuth, ctrlWorkouts.saveWorkout);
router.get('/workouts/saved', jwtAuth, ctrlWorkouts.getSavedWorkouts);
router.delete('/workouts/saved/type/:workoutType', jwtAuth, ctrlWorkouts.deleteSavedWorkoutByType);
router.delete('/workouts/saved/:workoutId', jwtAuth, ctrlWorkouts.deleteSavedWorkoutById);

module.exports = router;
