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
        required: true
    },
    effortLevel: {
        type: String,
        required: true,
        enum: ['No Effort', 'Low Effort', 'Full Effort']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema); 