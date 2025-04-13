const express = require('express');
const router = express.Router();
const mealPlansController = require('../controllers/mealPlans');

router.get('/', mealPlansController.getMealPlans);
router.get('/:id/download', mealPlansController.downloadMealPlan);

module.exports = router; 