const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    pdfData: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        default: 'application/pdf'
    },
    effortLevel: {
        type: String,
        required: true,
        enum: ['No Effort', 'Low Effort', 'Full Effort']
    }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema); 