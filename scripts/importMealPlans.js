const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MealPlan = require('../app_api/models/mealPlan');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/180s', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const mealPlans = [
    {
        name: '2432 Calorie Plan',
        calories: 2432,
        fat: 60,
        carbs: 243,
        protein: 228.5,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/2432 Calorie Meal Plan.pdf'
    },
    {
        name: '2302 Calorie Plan',
        calories: 2302,
        fat: 65,
        carbs: 207,
        protein: 214,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/2302 Calorie Meal Plan.pdf'
    },
    {
        name: '2220 Calorie Plan',
        calories: 2220,
        fat: 57,
        carbs: 221,
        protein: 198,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/2220 Calorie Meal Plan.pdf'
    },
    {
        name: '2200 Calorie Plan',
        calories: 2200,
        fat: 53,
        carbs: 211,
        protein: 214.5,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/2200 Calorie Meal Plan.pdf'
    },
    {
        name: '2160 Calorie Plan',
        calories: 2160,
        fat: 51,
        carbs: 221,
        protein: 194,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/2160 Calorie Meal Plan.pdf'
    },
    {
        name: '1970 Calorie Plan',
        calories: 1970,
        fat: 48,
        carbs: 186,
        protein: 183,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/1970 Calorie Meal Plan.pdf'
    },
    {
        name: '1442 Calorie Plan',
        calories: 1442,
        fat: 28,
        carbs: 141,
        protein: 164,
        effortLevel: 'No Effort',
        pdfPath: 'meal-plans/1442 Calorie Meal Plan.pdf'
    }
];

async function importMealPlans() {
    try {
        // Clear existing meal plans
        await MealPlan.deleteMany({});
        console.log('Cleared existing meal plans');

        // Import new meal plans
        for (const plan of mealPlans) {
            const pdfPath = path.join(__dirname, '..', 'public', plan.pdfPath);
            const pdfData = fs.readFileSync(pdfPath);
            
            await MealPlan.create({
                ...plan,
                pdfData,
                contentType: 'application/pdf'
            });
            
            console.log(`Imported ${plan.name}`);
        }

        console.log('All meal plans imported successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error importing meal plans:', error);
        process.exit(1);
    }
}

importMealPlans(); 