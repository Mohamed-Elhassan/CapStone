require('dotenv').config();

//Bring in the DB connection and the Trip schema
const mongoose = require('./db');
const MealPlan = require('./mealPlan');
const fs = require('fs');
const path = require('path');

//Read seed data from json file
const mealplans = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', '../../../data/mealplans.json'), 'utf-8'));

//Delete any existing records, then insert seed data
const seedDB = async () => {
    try {
        console.log('Starting database seeding...');
        
        // Delete existing meal plans
        await MealPlan.deleteMany({});
        console.log('Deleted existing meal plans');
        
        // Process and insert new meal plans
        const processedMealPlans = mealplans.map(item => {
            const processedItem = { ...item };
            
            // Convert ObjectId if present
            if (item._id && item._id.$oid) {
                processedItem._id = new mongoose.Types.ObjectId(item._id.$oid);
            }
            
            // Convert PDF data if present
            if (item.pdfData && item.pdfData.$binary) {
                processedItem.pdfData = Buffer.from(item.pdfData.$binary.base64, 'base64');
            }
            
            return processedItem;
        });
        
        // Insert the processed meal plans
        console.log('MONGODB_URI:', process.env.MONGODB_URI);
        await MealPlan.insertMany(processedMealPlans);
        console.log(`Successfully inserted ${processedMealPlans.length} meal plans`);
        
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
};

//Close the MongoDB connection and exit
seedDB().then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
})
.catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
});