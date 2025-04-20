const mongoose = require('mongoose');
const MealPlan = require('../models/mealPlan');
const User = require('../models/user');

const getMealPlans = async (req, res) => {
    try {
        const { effortLevel } = req.query;
        const query = effortLevel ? { effortLevel } : {};
        const mealPlans = await MealPlan.find(query);
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meal plans', error: error.message });
    }
};

const downloadMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.setHeader('Content-Type', mealPlan.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${mealPlan.name}.pdf"`);
        res.send(mealPlan.pdfData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a meal plan
const deleteMealPlan = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Only admins can delete meal plans' });
        }

        const { id } = req.params;
        const mealPlan = await MealPlan.findByIdAndDelete(id);

        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meal plan', error: error.message });
    }
};

// Save a meal plan
const saveMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const userId = req.user._id;

        // Check if meal plan exists
        const mealPlan = await MealPlan.findById(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        // Add meal plan to user's saved meal plans
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedMealPlans: mealPlanId } },
            { new: true }
        );

        res.json({ message: 'Meal plan saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving meal plan', error: error.message });
    }
};

// Unsave a meal plan
const unsaveMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const userId = req.user._id;

        // Remove meal plan from user's saved meal plans
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedMealPlans: mealPlanId } },
            { new: true }
        );

        res.json({ message: 'Meal plan unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unsaving meal plan', error: error.message });
    }
};

// Get user's saved meal plans
const getSavedMealPlans = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('savedMealPlans');
        
        res.json(user.savedMealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved meal plans', error: error.message });
    }
};

module.exports = {
    getMealPlans,
    downloadMealPlan,
    deleteMealPlan,
    saveMealPlan,
    unsaveMealPlan,
    getSavedMealPlans
}; 