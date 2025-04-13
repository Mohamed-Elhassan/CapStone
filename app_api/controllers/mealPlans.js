const MealPlan = require('../models/mealPlan');

const getMealPlans = async (req, res) => {
    try {
        const { effortLevel } = req.query;
        const query = effortLevel ? { effortLevel } : {};
        const mealPlans = await MealPlan.find(query).select('-pdfData');
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

module.exports = {
    getMealPlans,
    downloadMealPlan
}; 